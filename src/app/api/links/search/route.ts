import { NextRequest } from 'next/server';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { ilike, or, and, eq, sql } from 'drizzle-orm';
import { searchLinksSchema } from '@/lib/validation';
import { apiError, apiSuccess } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = searchLinksSchema.safeParse({
      q: searchParams.get('q'),
      nookId: searchParams.get('nookId') || undefined,
      limit: searchParams.get('limit') || undefined,
    });

    if (!parsed.success) {
      return apiError('Invalid search query', 400, parsed.error.flatten().fieldErrors);
    }

    const { q, nookId, limit } = parsed.data;
    const db = getDb();

    const conditions = [
      or(
        ilike(links.title, `%${q}%`),
        ilike(links.url, `%${q}%`),
        ilike(links.summary, `%${q}%`),
        sql`${q} = ANY(${links.tags})`,
      ),
    ];

    if (nookId) {
      conditions.push(eq(links.nookId, nookId));
    }

    const results = await db
      .select()
      .from(links)
      .where(and(...conditions))
      .limit(limit)
      .orderBy(links.createdAt);

    return apiSuccess({ links: results, total: results.length });
  } catch (error) {
    console.error('Search error:', error);
    return apiError('Failed to search links', 500);
  }
}
