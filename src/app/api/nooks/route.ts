import { NextRequest } from 'next/server';
import { getDb } from '@/db';
import { nooks, links } from '@/db/schema';
import { generateId } from '@/lib/utils';
import { createNookSchema } from '@/lib/validation';
import { apiError, apiSuccess, requireJson } from '@/lib/api-middleware';

export async function GET() {
  try {
    const db = getDb();
    const [allNooks, allLinks] = await Promise.all([
      db.select().from(nooks),
      db.select().from(links).orderBy(links.createdAt),
    ]);

    return apiSuccess({ nooks: allNooks, links: allLinks });
  } catch (error) {
    console.error('Fetch error:', error);
    return apiError('Failed to fetch', 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = createNookSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { name, color } = parsed.data;
    const db = getDb();
    const id = generateId();

    await db.insert(nooks).values({
      id,
      name,
      color: color || '#f5a623',
    });

    return apiSuccess({ id, name, color: color || '#f5a623' });
  } catch (error) {
    console.error('Create nook error:', error);
    return apiError('Failed to create nook', 500);
  }
}
