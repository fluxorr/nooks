import { NextRequest } from 'next/server';
import OpenAI from 'openai';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { generateId } from '@/lib/utils';
import { saveLinkSchema } from '@/lib/validation';
import { apiError, apiSuccess, requireJson, authenticate } from '@/lib/api-middleware';

function getOpenAI() {
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY,
  });
}

async function fetchUrlContent(url: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(`https://r.jina.ai/${url}`, { signal: controller.signal });
    if (!response.ok) throw new Error('Failed to fetch');
    const text = await response.text();
    return text.slice(0, 5000);
  } catch {
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

async function generateSummary(content: string, url: string): Promise<{ summary: string; tags: string[]; title: string }> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);

  try {
    const prompt = `Extract the following from this web content:
1. A 2-3 sentence summary
2. 3-5 relevant tags (single words, lowercase)
3. The title (if not clear, create a short descriptive one)

Content:
${content.slice(0, 3000)}

Respond in JSON format:
{"summary": "...", "tags": ["...", "..."], "title": "..."}`;

    const completion = await getOpenAI().chat.completions.create({
      model: 'google/gemma-2-9b-it:free',
      messages: [{ role: 'user', content: prompt }],
    }, { signal: controller.signal });

    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    return {
      summary: result.summary || '',
      tags: Array.isArray(result.tags) ? result.tags.slice(0, 10).map(String) : [],
      title: result.title || url,
    };
  } catch (e) {
    console.error('AI error:', e);
    return { summary: '', tags: [], title: url };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  const userId = await authenticate(req);
  if (!userId) return apiError('Unauthorized', 401);

  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = saveLinkSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { url, nookId, title: providedTitle } = parsed.data;

    let title = providedTitle || '';
    let summary = '';
    let tags: string[] = [];

    if (!title) {
      const content = await fetchUrlContent(url);
      if (content) {
        const result = await generateSummary(content, url);
        summary = result.summary;
        tags = result.tags;
        title = result.title;
      } else {
        title = url;
      }
    }

    const linkId = generateId();

    await getDb().insert(links).values({
      id: linkId,
      userId,
      url,
      title,
      summary,
      nookId: nookId || null,
      tags,
    });

    return apiSuccess({ id: linkId, title, summary, tags });
  } catch (error) {
    console.error('Save error:', error);
    return apiError('Failed to save link', 500);
  }
}
