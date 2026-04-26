import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { generateId } from '@/lib/utils';

function getOpenAI() {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

async function fetchUrlContent(url: string) {
  try {
    const response = await fetch(`https://r.jina.ai/${url}`);
    if (!response.ok) throw new Error('Failed to fetch');
    const text = await response.text();
    return text.slice(0, 5000);
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, nookId } = await req.json();

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const content = await fetchUrlContent(url);

    let summary = '';
    let tags: string[] = [];
    let title = '';

    if (content) {
      const prompt = `Extract the following from this web content:
1. A 2-3 sentence summary
2. 3-5 relevant tags (single words, lowercase)
3. The title (if not clear, create a short descriptive one)

Content:
${content.slice(0, 3000)}

Respond in JSON format:
{"summary": "...", "tags": ["...", "..."], "title": "..."}`;

      const completion = await getOpenAI().chat.completions.create({
        model: 'meta-llama/llama-3.1-8b-instruct',
        messages: [{ role: 'user', content: prompt }],
      });

      try {
        const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
        summary = result.summary || '';
        tags = result.tags || [];
        title = result.title || url;
      } catch {
        title = url;
      }
    } else {
      title = url;
    }

    const linkId = generateId();

    await getDb().insert(links).values({
      id: linkId,
      url,
      title,
      summary,
      nookId: nookId || 'inbox',
      tags,
    });

    return NextResponse.json({ id: linkId, title, summary, tags });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json({ error: 'Failed to save link' }, { status: 500 });
  }
}