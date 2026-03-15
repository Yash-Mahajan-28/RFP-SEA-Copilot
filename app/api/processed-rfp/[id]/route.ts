import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDatabase();
    const processed = await db.collection('processed_rfps').findOne({ rfpId: id });
    if (!processed) {
      return NextResponse.json({ found: false }, { status: 404 });
    }
    return NextResponse.json({ found: true, ...processed });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch processed RFP' }, { status: 500 });
  }
}