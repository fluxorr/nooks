import { NextRequest } from 'next/server';
import { getDb } from '@/db';
import { apiTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { generateId } from '@/lib/utils';
import { apiError, apiSuccess, authenticate } from '@/lib/api-middleware';

export async function GET(req: NextRequest) {
  const userId = await authenticate(req);
  if (!userId) return apiError('Unauthorized', 401);

  const db = getDb();
  const existing = await db.select().from(apiTokens).where(eq(apiTokens.userId, userId)).limit(1);
  return apiSuccess({ token: existing[0]?.token || null });
}

export async function POST(req: NextRequest) {
  const userId = await authenticate(req);
  if (!userId) return apiError('Unauthorized', 401);

  const token = generateId() + generateId();
  const db = getDb();

  await db.delete(apiTokens).where(eq(apiTokens.userId, userId));
  await db.insert(apiTokens).values({ userId, token });

  return apiSuccess({ token });
}
