import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { nooks, links } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { generateId } from '@/lib/utils';
import { createNookSchema, updateNookSchema } from '@/lib/validation';
import { apiError, apiSuccess, requireJson } from '@/lib/api-middleware';

function unauthorized() {
  return apiError('Unauthorized', 401);
}

export async function GET() {
  const { userId } = auth();
  if (!userId) return unauthorized();

  try {
    const db = getDb();
    const [userNooks, userLinks] = await Promise.all([
      db.select().from(nooks).where(eq(nooks.userId, userId)),
      db.select().from(links).where(eq(links.userId, userId)).orderBy(links.createdAt),
    ]);

    return apiSuccess({ nooks: userNooks, links: userLinks });
  } catch (error) {
    console.error('Fetch error:', error);
    return apiError('Failed to fetch', 500);
  }
}

export async function POST(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return unauthorized();

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
      userId,
      name,
      color: color || '#f5a623',
    });

    return apiSuccess({ id, userId, name, color: color || '#f5a623' });
  } catch (error) {
    console.error('Create nook error:', error);
    return apiError('Failed to create nook', 500);
  }
}

export async function PATCH(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return unauthorized();

  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = updateNookSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { id, isPublic } = parsed.data;
    const db = getDb();

    const existing = await db
      .select()
      .from(nooks)
      .where(and(eq(nooks.id, id), eq(nooks.userId, userId)))
      .limit(1);
    if (existing.length === 0) {
      return apiError('Nook not found', 404);
    }

    await db.update(nooks).set({ isPublic }).where(eq(nooks.id, id));

    return apiSuccess({ id, isPublic });
  } catch (error) {
    console.error('Update nook error:', error);
    return apiError('Failed to update nook', 500);
  }
}
