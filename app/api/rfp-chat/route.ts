import { NextResponse } from 'next/server';
import rfpDataSource from '@/public/rfp_data.json';
import { type RFP } from '@/lib/rfpParser';
import { getDatabase } from '@/lib/mongodb';
import { rfpChatbotAgent } from '@/lib/rfp-chat-agent';

async function loadRfpById(rfpId: string): Promise<RFP | null> {
  const today = new Date();

  if (rfpDataSource[rfpId as keyof typeof rfpDataSource]) {
    const data = rfpDataSource[rfpId as keyof typeof rfpDataSource];
    const offset = data.due_date_offset_days || 0;
    const dueDate = new Date(today.getTime() + offset * 24 * 60 * 60 * 1000);

    return {
      id: rfpId,
      title: data.title,
      due_date: dueDate.toISOString().split('T')[0],
      due_date_offset_days: offset,
      scope: data.scope,
      tests: data.tests,
      origin_url: data.origin_url,
      issuing_entity: data.issuing_entity,
      executor: data.executor,
      type: data.type,
    };
  }

  try {
    const db = await getDatabase();
    const uploads = db.collection('uploaded_rfps');
    const uploadedDoc = await uploads.findOne({ 'rfp.id': rfpId });
    if (uploadedDoc?.rfp) {
      return uploadedDoc.rfp as RFP;
    }
  } catch (error) {
    console.warn('MongoDB lookup failed in /api/rfp-chat:', error);
  }

  return null;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rfpId = String(body.rfpId || '').trim();
    const userRequirement = String(body.userRequirement || '').trim();
    const question = String(body.question || '').trim();

    if (!rfpId) {
      return NextResponse.json({ success: false, error: 'rfpId is required' }, { status: 400 });
    }

    if (!userRequirement) {
      return NextResponse.json({ success: false, error: 'userRequirement is required' }, { status: 400 });
    }

    if (!question) {
      return NextResponse.json({ success: false, error: 'question is required' }, { status: 400 });
    }

    const rfp = await loadRfpById(rfpId);
    if (!rfp) {
      return NextResponse.json({ success: false, error: 'RFP not found' }, { status: 404 });
    }

    const startedAt = Date.now();
    const result = await rfpChatbotAgent.run({
      rfp,
      userRequirement,
      userQuestion: question,
    });
    const durationMs = Date.now() - startedAt;

    try {
      const db = await getDatabase();
      await db.collection('agent_logs').insertOne({
        timestamp: new Date(),
        rfpId,
        rfpTitle: rfp.title,
        agent: 'Main',
        level: 'info',
        message: 'RFP Chatbot Agent completed (Perception -> Decision -> Action)',
        durationMs,
        data: {
          requirement: userRequirement,
          question,
          trace: result.trace,
        },
      });
    } catch (error) {
      console.warn('Failed to persist chat agent log:', error);
    }

    return NextResponse.json({
      success: true,
      rfpId,
      rfpTitle: rfp.title,
      durationMs,
      ...result,
    });
  } catch (error) {
    console.error('POST /api/rfp-chat error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to process chat request',
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'online',
    workflow: ['perception', 'decision', 'action'],
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    configured: !!process.env.GEMINI_API_KEY,
  });
}
