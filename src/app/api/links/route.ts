import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { moveLinkSchema, deleteLinkSchema } from '@/lib/validation';

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = moveLinkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { linkId, nookId } = parsed.data;
    const db = getDb();
    await db.update(links).set({ nookId }).where(eq(links.id, linkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = deleteLinkSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { linkId } = parsed.data;
    const db = getDb();
    await db.delete(links).where(eq(links.id, linkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}
