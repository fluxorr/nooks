import { getDb } from '@/db';
import { links, nooks } from '@/db/schema';
import { sql, count } from 'drizzle-orm';
import { apiError, apiSuccess } from '@/lib/api-middleware';

export async function GET() {
  try {
    const db = getDb();

    const [totalLinks, totalNooks, thisWeek, linksPerNook] = await Promise.all([
      db.select({ value: count() }).from(links),
      db.select({ value: count() }).from(nooks),
      db.select({ value: count() }).from(links).where(
        sql`${links.createdAt} > now() - interval '7 days'`
      ),
      db.select({
        nookId: links.nookId,
        count: count(),
      }).from(links).groupBy(links.nookId),
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
