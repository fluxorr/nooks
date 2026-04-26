import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { nooks, links } from '@/db/schema';
import { generateId } from '@/lib/utils';

export async function GET() {
  try {
    const db = getDb();
    const allNooks = await db.select().from(nooks);
    const allLinks = await db.select().from(links).orderBy(links.createdAt);

    return NextResponse.json({ nooks: allNooks, links: allLinks });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, color } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = getDb();
    const id = generateId();

    await db.insert(nooks).values({
      id,
      name,
      color: color || '#f5a623',
    });

    return NextResponse.json({ id, name, color });
  } catch (error) {
    console.error('Create nook error:', error);
    return NextResponse.json({ error: 'Failed to create nook' }, { status: 500 });
  }
}