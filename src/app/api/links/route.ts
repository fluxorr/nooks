import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { links } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(req: NextRequest) {
  try {
    const { linkId, nookId } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    const db = getDb();

    await db.update(links).set({ nookId: nookId || null }).where(eq(links.id, linkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update link error:', error);
    return NextResponse.json({ error: 'Failed to update link' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { linkId } = await req.json();

    if (!linkId) {
      return NextResponse.json({ error: 'Link ID is required' }, { status: 400 });
    }

    const db = getDb();
    await db.delete(links).where(eq(links.id, linkId));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete link error:', error);
    return NextResponse.json({ error: 'Failed to delete link' }, { status: 500 });
  }
}