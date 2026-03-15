import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function DELETE(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDatabase();
    const uploads = db.collection('uploaded_rfps');
    const processed = db.collection('processed_rfps');

    const delUpload = await uploads.deleteOne({ 'rfp.id': id });
    await processed.deleteOne({ rfpId: id });

    return NextResponse.json({
      success: true,
      deleted: delUpload.deletedCount,
      rfpId: id,
    });
  } catch (err) {
    console.error('Delete RFP error:', err);
    return NextResponse.json({ error: 'Failed to delete RFP' }, { status: 500 });
  }
}