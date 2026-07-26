import { NextRequest } from 'next/server';
import { getDb } from '@/db';
import { links, nooks } from '@/db/schema';
import { sql, eq, count, and } from 'drizzle-orm';
import { apiError, apiSuccess, authenticate } from '@/lib/api-middleware';

export async function GET(req?: NextRequest) {
  const userId = await authenticate(req);
  if (!userId) return apiError('Unauthorized', 401);

  try {
    const db = getDb();

    const [totalLinks, totalNooks, thisWeek, linksPerNook] = await Promise.all([
      db.select({ value: count() }).from(links).where(eq(links.userId, userId)),
      db.select({ value: count() }).from(nooks).where(eq(nooks.userId, userId)),
      db.select({ value: count() }).from(links).where(
        and(eq(links.userId, userId), sql`${links.createdAt} > now() - interval '7 days'`)
      ),
      db.select({
        nookId: links.nookId,
        count: count(),
      }).from(links).where(eq(links.userId, userId)).groupBy(links.nookId),
    ]);

    return apiSuccess({
      totalLinks: totalLinks[0]?.value ?? 0,
      totalNooks: totalNooks[0]?.value ?? 0,
      linksThisWeek: thisWeek[0]?.value ?? 0,
      linksPerNook: linksPerNook.reduce<Record<string, number>>((acc, row) => {
        acc[row.nookId ?? 'inbox'] = row.count;
        return acc;
      }, {}),
    });
  } catch (error) {
    console.error('Stats error:', error);
    return apiError('Failed to fetch stats', 500);
  }
}
