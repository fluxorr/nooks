import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { moveLinkSchema, deleteLinkSchema } from '@/lib/validation';
import { apiError, apiSuccess, requireJson } from '@/lib/api-middleware';

function unauthorized() {
  return apiError('Unauthorized', 401);
}

export async function PATCH(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return unauthorized();

  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = moveLinkSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { linkId, nookId } = parsed.data;
    const db = getDb();
    await db
      .update(links)
      .set({ nookId })
      .where(and(eq(links.id, linkId), eq(links.userId, userId)));

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Update link error:', error);
    return apiError('Failed to update link', 500);
  }
}

export async function DELETE(req: NextRequest) {
  const { userId } = auth();
  if (!userId) return unauthorized();

  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = deleteLinkSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { linkId } = parsed.data;
    const db = getDb();
    await db
      .delete(links)
      .where(and(eq(links.id, linkId), eq(links.userId, userId)));

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Delete link error:', error);
    return apiError('Failed to delete link', 500);
  }
}
