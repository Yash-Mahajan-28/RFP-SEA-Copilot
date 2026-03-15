import { NextResponse } from 'next/server';
import { mainAgent } from '@/lib/langchain-agents';
import rfpDataSource from '@/public/rfp_data.json';
import { type RFP } from '@/lib/rfpParser';
import { getDatabase } from '@/lib/mongodb';

export async function POST(request: Request) {
  try {
    const { rfpId } = await request.json();
    
    if (!rfpId) {
      return NextResponse.json({ error: 'RFP ID is required' }, { status: 400 });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return NextResponse.json({ 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env.local',
        configured: false,
      }, { status: 503 });
    }

    // Get RFP data from static JSON and MongoDB (uploaded RFPs)
    const today = new Date();
    const rfps: RFP[] = [];
    
    // Process each RFP from static JSON data
    Object.keys(rfpDataSource).forEach((id) => {
      const data = rfpDataSource[id as keyof typeof rfpDataSource];
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
    
    let rfp = rfps.find(r => r.id === rfpId);
    
    // If not found in static data, check MongoDB for uploaded RFPs
    if (!rfp) {
      try {
        const db = await getDatabase();
        const uploads = db.collection('uploaded_rfps');
        const uploadedDoc = await uploads.findOne({ 'rfp.id': rfpId });
        
        if (uploadedDoc && uploadedDoc.rfp) {
          rfp = uploadedDoc.rfp as RFP;
          console.log('📤 Found uploaded RFP in MongoDB');
        }
      } catch (dbError) {
        console.error('MongoDB lookup error:', dbError);
      }
    }
    
    if (!rfp) {
      return NextResponse.json({ error: 'RFP not found in catalog or uploads' }, { status: 404 });
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`🚀 Processing RFP: ${rfp.id}`);
    console.log(`Title: ${rfp.title}`);
    console.log(`${'='.repeat(60)}\n`);

    // Process with LangChain agents
    const startTime = Date.now();
    const result = await mainAgent.processRFP(rfp);
    const processingTime = Date.now() - startTime;

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ Processing Complete (${processingTime}ms)`);
    console.log(`Decision: ${result.decision}`);
    console.log(`${'='.repeat(60)}\n`);

    // Persist logs, reports, and processed result
    try {
      const db = await getDatabase();
      const logs = db.collection('agent_logs');
      const reports = db.collection('agent_reports');
      const processed = db.collection('processed_rfps');

      // Per-agent logs
      if (result.salesResult) {
        await logs.insertOne({
          timestamp: new Date(),
          rfpId,
          rfpTitle: rfp.title,
          agent: 'Sales',
          level: 'info',
          message: 'Sales Agent completed',
          durationMs: result.timings?.salesMs,
          data: result.salesResult,
        });
      }
      if (result.techResult) {
        await logs.insertOne({
          timestamp: new Date(),
          rfpId,
          rfpTitle: rfp.title,
          agent: 'Tech',
          level: 'info',
          message: 'Tech Agent completed',
          durationMs: result.timings?.techMs,
          data: result.techResult,
        });
      }
      if (result.pricingResult) {
        await logs.insertOne({
          timestamp: new Date(),
          rfpId,
          rfpTitle: rfp.title,
          agent: 'Pricing',
          level: 'info',
          message: 'Pricing Agent completed',
          durationMs: result.timings?.pricingMs,
          data: result.pricingResult,
        });
      }

      // Main agent + collective logs
      await logs.insertOne({
        timestamp: new Date(),
        rfpId,
        rfpTitle: rfp.title,
        agent: 'Main',
        level: 'info',
        message: `Main Agent decision: ${result.decision}`,
        durationMs: result.timings?.totalMs ?? processingTime,
        data: result,
      });
      await logs.insertOne({
        timestamp: new Date(),
        rfpId,
        rfpTitle: rfp.title,
        agent: 'Collective',
        level: 'info',
        message: 'Collective processing complete',
        durationMs: processingTime,
        data: {
          decision: result.decision,
          confidence: result.confidence,
          timings: result.timings,
        },
      });

      // Reports per agent
      if (result.salesResult) {
        await reports.insertOne({
          createdAt: new Date(),
          rfpId,
          rfpTitle: rfp.title,
          agent: 'Sales',
          summary: `Qualified: ${result.salesResult.qualified ? 'Yes' : 'No'}, Priority: ${result.salesResult.priority}, Win Probability: ${result.salesResult.winProbability}%`,
          metrics: {
            winProbability: result.salesResult.winProbability ?? 0,
          },
          data: result.salesResult,
        });
      }
      if (result.techResult) {
        await reports.insertOne({
          createdAt: new Date(),
          rfpId,
          rfpTitle: rfp.title,
          agent: 'Tech',
          summary: `Match Confidence: ${result.techResult.matchConfidence}%, Matched: ${result.techResult.matchedItems}/${result.techResult.totalItems}`,
          metrics: {
            matchConfidence: result.techResult.matchConfidence ?? 0,
          },
          data: result.techResult,
        });
      }
      if (result.pricingResult) {
        await reports.insertOne({
          createdAt: new Date(),
          rfpId,
          rfpTitle: rfp.title,
          agent: 'Pricing',
          summary: `Bid Price: ${result.pricingResult.finalBidPrice?.toLocaleString?.() || result.pricingResult.finalBidPrice}, Margin: ${result.pricingResult.recommendedMargin}%`,
          metrics: {
            finalBidPrice: result.pricingResult.finalBidPrice ?? 0,
            margin: result.pricingResult.recommendedMargin ?? 0,
          },
          data: result.pricingResult,
        });
      }

      // Collective report
      await reports.insertOne({
        createdAt: new Date(),
        rfpId,
        rfpTitle: rfp.title,
        agent: 'Collective',
        summary: `Decision: ${result.decision.toUpperCase()} with ${result.confidence}% confidence`,
        metrics: {
          confidence: result.confidence ?? 0,
        },
        data: {
          decision: result.decision,
          confidence: result.confidence,
          sales: result.salesResult,
          tech: result.techResult,
          pricing: result.pricingResult,
        },
      });

      // Upsert processed results for quick retrieval later
      await processed.updateOne(
        { rfpId },
        {
          $set: {
            rfpId,
            rfpTitle: rfp.title,
            rfp,
            result,
            processedAt: new Date(),
            processingTime,
          },
        },
        { upsert: true }
      );
    } catch (persistErr) {
      console.error('Failed to persist logs/reports:', persistErr);
      // continue without failing request
    }

    return NextResponse.json({
      success: true,
      rfpId,
      rfpTitle: rfp.title,
      processingTime,
      result,
    });
  } catch (error) {
    console.error('Error processing RFP:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to process RFP',
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}

// GET endpoint to check agent status
export async function GET() {
  const configured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here');
  
  return NextResponse.json({
    status: 'online',
    configured,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash-latest',
    temperature: process.env.GEMINI_TEMPERATURE || '0.7',
    agents: [
      {
        name: 'Sales Agent',
        status: 'ready',
        description: 'RFP qualification and prioritization',
      },
      {
        name: 'Tech Agent',
        status: 'ready',
        description: 'Specification matching and product recommendation',
      },
      {
        name: 'Pricing Agent',
        status: 'ready',
        description: 'Cost calculation and competitive pricing',
      },
      {
        name: 'Main Agent',
        status: 'ready',
        description: 'Workflow orchestration and final decision',
      },
    ],
    message: configured 
      ? 'All agents ready' 
      : 'Gemini API key not configured. Set GEMINI_API_KEY in .env.local',
  });
}
