import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

export async function GET(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const db = await getDatabase();
    const uploads = db.collection('uploaded_rfps');

    const upload = await uploads.findOne({ 'rfp.id': id });
    if (!upload || !upload.pdfBuffer) {
      return NextResponse.json({ error: 'PDF not found' }, { status: 404 });
    }

    const pdfBuffer = Buffer.from(upload.pdfBuffer, 'base64');
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${upload.fileName || 'rfp.pdf'}"`,
      },
    });
  } catch (err) {
    console.error('PDF retrieval error:', err);
    return NextResponse.json({ error: 'Failed to retrieve PDF' }, { status: 500 });
  }
}
