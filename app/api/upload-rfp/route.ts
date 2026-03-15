import { NextRequest, NextResponse } from 'next/server';
import pdfParse from 'pdf-parse';
import { getDatabase } from '@/lib/mongodb';
import type { RFP, RFPItem } from '@/lib/rfpParser';
import { parseWithGemini } from '@/lib/rfpParser';
import { MainAgent } from '@/lib/langchain-agents';

function extractItemsFromText(text: string): RFPItem[] {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const items: RFPItem[] = [];
  let idCounter = 1;
  
  for (const line of lines) {
    // Skip very short lines or headers
    if (line.length < 5 || /^(item|description|qty|quantity|specs?|total)/i.test(line)) {
      continue;
    }

    // Heuristic: match patterns like "Qty", voltage "kV", conductor size "mm2" or "mm²", insulation "mm"
    const qtyMatch = line.match(/qty\s*[:\-]?\s*(\d+)/i);
    const voltMatch = line.match(/(\d{1,2})\s*k\s*v|volt(?:age)?\s*(\d{1,2})/i);
    const condMatch = line.match(/(\d{1,3})\s*mm\s*2|mm²|(\d{1,3})\s*mm2/i);
    const insulMatch = line.match(/insul(?:ation)?\s*(\d(?:\.\d)?)\s*mm/i);

    const qty = qtyMatch ? parseInt(qtyMatch[1] || '1', 10) : 1;
    const voltage = voltMatch ? parseInt(voltMatch[1] || voltMatch[2] || '1', 10) : 1;
    const conductor = condMatch ? parseInt(condMatch[1] || condMatch[2] || '4', 10) : 4;
    const insulation = insulMatch ? parseFloat(insulMatch[1]) : 1.0;

    // Match cable/electrical items
    if (voltMatch || condMatch) {
      items.push({
        item_id: idCounter++,
        description: line.slice(0, 120),
        qty,
        specs: { conductor_size_mm2: conductor, voltage_kv: voltage, insulation_mm: insulation },
      });
      continue;
    }

    // Match general items: bullet points, numbered lists, or lines with common item keywords
    const isBullet = /^[•\-\*\d+\.)]\s*/i.test(line);
    const hasItemKeywords = /(paint|brush|supply|material|product|item|cable|wire|equipment|tool)/i.test(line);
    const hasQuantity = /\d+\s*(pcs?|units?|boxes?|gallons?|liters?|meters?|kg|lbs?)/i.test(line);
    
    if ((isBullet || hasItemKeywords || hasQuantity) && line.length > 10) {
      // Extract quantity if present
      const generalQtyMatch = line.match(/(\d+)\s*(pcs?|units?|boxes?|gallons?|liters?|meters?|kg|lbs?)?/i);
      const extractedQty = generalQtyMatch ? parseInt(generalQtyMatch[1], 10) : 1;
      
      items.push({
        item_id: idCounter++,
        description: line.replace(/^[•\-\*\d+\.)]\s*/, '').slice(0, 120),
        qty: extractedQty,
        specs: { conductor_size_mm2: 4, voltage_kv: 1, insulation_mm: 1.0 },
      });
    }
  }

  // If still no items, try to find any substantial text lines
  if (items.length === 0) {
    const substantialLines = lines.filter(l => l.length > 20 && l.length < 200);
    substantialLines.slice(0, 5).forEach((line, idx) => {
      items.push({
        item_id: idx + 1,
        description: line,
        qty: 1,
        specs: { conductor_size_mm2: 4, voltage_kv: 1, insulation_mm: 1.0 },
      });
    });
  }

  return items;
}

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData();
    const file = form.get('file');
    const title = (form.get('title') as string) || 'Uploaded RFP';
    const entity = (form.get('entity') as string) || 'Unknown';
    const type = (form.get('type') as string) || 'Unknown';
    const dueDate = (form.get('due_date') as string) || new Date().toISOString().split('T')[0];

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse PDF text
    const parsed = await pdfParse(buffer);
    const text = parsed.text || '';

    // Convert to RFP schema using Gemini ONLY (no heuristic fallback)
    let rfp: RFP;
    let parserUsed: 'gemini' | 'heuristic' = 'gemini';
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      console.error('❌ No Gemini API key configured!');
      return NextResponse.json({ 
        success: false, 
        error: 'Gemini API key not configured. Please set GEMINI_API_KEY in .env.local',
        hint: 'Get your API key from https://aistudio.google.com/app/apikey'
      }, { status: 503 });
    }
    
    console.log('🔑 Gemini API key found, attempting AI parsing...');
    console.log('📄 PDF text length:', text.length, 'characters');
    console.log('📝 PDF text preview:', text.slice(0, 500));
    
    const result = await parseWithGemini(text);
    
    if (!result.rfp) {
      console.error('❌ Gemini parsing completely failed');
      console.error('📄 PDF text preview:', text.slice(0, 500));
      return NextResponse.json({ 
        success: false, 
        error: 'Gemini AI could not extract structured data from this PDF.',
        details: 'The document may be: (1) a scanned image requiring OCR, (2) have complex formatting, (3) contain no clear item lists, or (4) be corrupted.',
        suggestions: [
          'Ensure PDF contains actual text (not just images)',
          'Check if the document has a clear list of items/products',
          'Try a simpler PDF format if possible',
          'Verify the PDF is not password protected'
        ],
        pdfTextPreview: text.slice(0, 800),
        textLength: text.length,
        hasText: text.length > 50
      }, { status: 422 });
    }
    
    rfp = result.rfp;
    console.log('✅ Using Gemini-parsed RFP');
    console.log('📊 Extracted items:', rfp.scope.length);

    // Persist to MongoDB
    try {
      const db = await getDatabase();
      const uploads = db.collection('uploaded_rfps');
      await uploads.insertOne({
        createdAt: new Date(),
        fileName: (file as any).name || 'rfp.pdf',
        size: (file as any).size || buffer.length,
        text,
        rfp,
        pdfBuffer: buffer.toString('base64'), // Store PDF as base64 for retrieval
      });

      // Auto-process with agents and persist results so user doesn't re-run
      try {
        const agent = new MainAgent();
        const result = await agent.processRFP(rfp);
        const processed = db.collection('processed_rfps');
        await processed.updateOne(
          { rfpId: rfp.id },
          {
            $set: {
              rfpId: rfp.id,
              rfpTitle: rfp.title,
              rfp,
              result,
              processedAt: new Date(),
            },
          },
          { upsert: true }
        );
      } catch (procErr) {
        console.error('Auto-process after upload failed:', procErr);
      }
    } catch (e) {
      // If DB fails, continue and return parsed output
      console.error('Upload persist error:', e);
    }

    return NextResponse.json({ success: true, rfp, parser: parserUsed });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process uploaded PDF' }, { status: 500 });
  }
}
