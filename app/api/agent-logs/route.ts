import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/lib/mongodb';

type AgentName = 'Sales' | 'Tech' | 'Pricing' | 'Main' | 'Collective';

interface AgentLog {
  _id?: string;
  timestamp: Date;
  rfpId?: string;
  rfpTitle?: string;
  agent: AgentName;
  level: 'info' | 'warn' | 'error';
  message: string;
  durationMs?: number;
  data?: any;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const agent = searchParams.get('agent') as AgentName | null;
    const rfpId = searchParams.get('rfpId');
    const limit = Math.min(parseInt(searchParams.get('limit') || '100', 10), 500);

    const db = await getDatabase();
    const collection = db.collection<AgentLog>('agent_logs');

    const query: any = {};
    if (agent) query.agent = agent;
    if (rfpId) query.rfpId = rfpId;

    const logs = await collection
      .find(query)
      .sort({ timestamp: -1 })
      .limit(limit)
      .toArray();

    return NextResponse.json({ success: true, logs });
  } catch (error) {
    console.error('GET /api/agent-logs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch logs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { agent, level = 'info', message, rfpId, rfpTitle, durationMs, data } = body as Partial<AgentLog>;

    if (!agent || !message) {
      return NextResponse.json({ success: false, error: 'agent and message are required' }, { status: 400 });
    }

    const db = await getDatabase();
    const collection = db.collection<AgentLog>('agent_logs');

    const log: AgentLog = {
      agent: agent as AgentName,
      level: (level as 'info' | 'warn' | 'error') || 'info',
      message,
      rfpId,
      rfpTitle,
      durationMs,
      data,
      timestamp: new Date(),
    };

    const result = await collection.insertOne(log as any);
    return NextResponse.json({ success: true, id: result.insertedId, log });
  } catch (error) {
    console.error('POST /api/agent-logs error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create log' }, { status: 500 });
  }
}
