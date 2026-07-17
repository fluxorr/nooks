import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/db';
import { nooks, links } from '@/db/schema';
import { generateId } from '@/lib/utils';
import { createNookSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = getDb();
    const [allNooks, allLinks] = await Promise.all([
      db.select().from(nooks),
      db.select().from(links).orderBy(links.createdAt),
    ]);

    return NextResponse.json({ nooks: allNooks, links: allLinks });
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createNookSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, color } = parsed.data;
    const db = getDb();
    const id = generateId();

    await db.insert(nooks).values({
      id,
      name,
      color: color || '#f5a623',
    });

    return NextResponse.json({ id, name, color: color || '#f5a623' });
  } catch (error) {
    console.error('Create nook error:', error);
    return NextResponse.json({ error: 'Failed to create nook' }, { status: 500 });
  }
}
