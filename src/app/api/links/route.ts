import { NextRequest } from 'next/server';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { moveLinkSchema, deleteLinkSchema } from '@/lib/validation';
import { apiError, apiSuccess, requireJson } from '@/lib/api-middleware';

export async function PATCH(req: NextRequest) {
  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = moveLinkSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { linkId, nookId } = parsed.data;
    const db = getDb();
    await db.update(links).set({ nookId }).where(eq(links.id, linkId));

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Update link error:', error);
    return apiError('Failed to update link', 500);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { json, error } = await requireJson(req);
    if (error) return error;

    const parsed = deleteLinkSchema.safeParse(json);

    if (!parsed.success) {
      return apiError('Invalid request', 400, parsed.error.flatten().fieldErrors);
    }

    const { linkId } = parsed.data;
    const db = getDb();
    await db.delete(links).where(eq(links.id, linkId));

    return apiSuccess({ success: true });
  } catch (error) {
    console.error('Delete link error:', error);
    return apiError('Failed to delete link', 500);
  }
}
