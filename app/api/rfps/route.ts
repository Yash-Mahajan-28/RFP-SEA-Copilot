import { NextResponse } from 'next/server';
import rfpData from '@/public/rfp_data.json';
import { getDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const today = new Date();
    const rfps: any[] = [];

    // Static catalog RFPs
    Object.keys(rfpData).forEach((id) => {
      const data = rfpData[id as keyof typeof rfpData];
      const offset = data.due_date_offset_days || 0;
      const dueDate = new Date(today.getTime() + offset * 24 * 60 * 60 * 1000);
      rfps.push({
        id,
        title: data.title,
        due_date: dueDate.toISOString().split('T')[0],
        due_date_offset_days: offset,
        scope: data.scope,
        tests: data.tests,
        origin_url: data.origin_url,
        issuing_entity: data.issuing_entity,
        executor: data.executor,
        type: data.type,
      });
    });

    // Uploaded RFPs from DB
    try {
      const db = await getDatabase();
      const uploads = db.collection('uploaded_rfps');
      const processed = db.collection('processed_rfps');
      const uploadedDocs = await uploads.find({}, { projection: { rfp: 1, createdAt: 1 } }).sort({ createdAt: -1 }).toArray();

      // Map processed results by rfpId for quick join
      const processedDocs = await processed.find({}, { projection: { rfpId: 1, result: 1, processedAt: 1 } }).toArray();
      const processedMap = new Map(processedDocs.map(doc => [doc.rfpId, { result: doc.result, processedAt: doc.processedAt }]));

      uploadedDocs.forEach(doc => {
        const r = doc.rfp;
        const processedInfo = processedMap.get(r.id);
        rfps.push({
          ...r,
          uploadedAt: doc.createdAt,
          processedSummary: processedInfo?.result ? {
            decision: processedInfo.result.decision,
            confidence: processedInfo.result.confidence,
          } : null,
          processedAt: processedInfo?.processedAt || null,
        });
      });
    } catch (dbErr) {
      // If DB is not configured, just return static rfps
      console.warn('DB not available for uploaded RFPs:', dbErr);
    }

    return NextResponse.json(rfps);
  } catch (error) {
    console.error('Error parsing RFP source:', error);
    return NextResponse.json({ error: 'Failed to parse RFPs' }, { status: 500 });
  }
}
