import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

type AgentName = 'Sales' | 'Tech' | 'Pricing' | 'Main' | 'Collective';

interface AgentReport {
  _id?: string;
  createdAt: Date;
  rfpId?: string;
  rfpTitle?: string;
  agent: AgentName;
  summary: string;
  metrics?: Record<string, number>;
  data?: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent') as AgentName | null;
    const rfpId = searchParams.get('rfpId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

    const db = await getDatabase();
    const collection = db.collection<AgentReport>('agent_reports');

    const query: any = {};
    if (agent) query.agent = agent;
    if (rfpId) query.rfpId = rfpId;

    const reports = await collection
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, reports });
  } catch (error) {
    console.error('GET /api/agent-reports error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch reports' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, summary, rfpId, rfpTitle, metrics, data } = body as Partial<AgentReport>;

    if (!agent || !summary) {
      return NextResponse.json({ success: false, error: 'agent and summary are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<AgentReport>('agent_reports');

    const report: AgentReport = {
      agent: agent as AgentName,
      summary,
      rfpId,
      rfpTitle,
      metrics,
      data,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(report as any);
    return NextResponse.json({ success: true, id: result.insertedId, report });
  } catch (error) {
    console.error('POST /api/agent-reports error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create report' }, { status: 500 });
  }
}
