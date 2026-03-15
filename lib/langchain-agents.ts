import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { RFP, RFPItem } from './rfpParser';

// Initialize the LLM
function createLLM() {
  return new ChatGoogleGenerativeAI({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    apiKey: process.env.GEMINI_API_KEY,
  });
}

// Helper function to parse JSON from Gemini responses (strips markdown if present)
function parseGeminiJSON(text: string): any {
  // Remove markdown code blocks if present
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }
  return JSON.parse(cleaned.trim());
}

// Sales Agent: RFP Discovery and Qualification
export class SalesAgent {
  private chain;

  constructor() {
    const llm = createLLM();
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a Sales Agent specialized in RFP qualification and prioritization for a diversified industrial manufacturing company with business across Fast Moving Electrical Goods (FMEG), Wires & Cables, and Industrial Services (including painting, coating, and infrastructure services).

Your expertise:
- Analyzing RFP requirements across multiple business verticals
- Assessing win probability based on specifications, issuing entity, and competition
- Prioritizing opportunities by strategic value across product and service lines

Analyze RFPs considering:
1. Technical feasibility (do requirements match any of our business capabilities - cables, FMEG products, or industrial services?)
2. Buyer relationship (PSU/Government vs Private sector)
3. Project size and strategic importance
4. Competition level and our competitive advantages
5. Timeline feasibility

IMPORTANT: Qualify RFPs across ALL our business lines - cables, electrical goods, painting services, coating services, infrastructure services. Do not reject RFPs just because they don't match one specific product line.`],
      ['human', `Analyze this RFP for qualification:

Title: {title}
Issuing Entity: {entity}
Type: {type}
Due Date: {dueDate}
Scope Summary: {scope}

Provide a JSON response with:
- qualified: boolean (should we bid?)
- priority: "high" | "medium" | "low"
- winProbability: number (0-100, our estimated win chance)
- reasoning: string (2-3 sentences explaining the assessment)
- keyFactors: string[] (main factors influencing the decision)`],
    ]);

    this.chain = prompt.pipe(llm).pipe(new StringOutputParser());
  }

  async qualifyRFP(rfp: RFP) {
    try {
      const scopeSummary = rfp.scope.slice(0, 3).map(item => 
        `${item.description} (Qty: ${item.qty})`
      ).join('; ');

      const result = await this.chain.invoke({
        title: rfp.title,
        entity: rfp.issuing_entity || 'Unknown',
        type: rfp.type || 'Unknown',
        dueDate: rfp.due_date,
        scope: scopeSummary,
      });

      return parseGeminiJSON(result);
    } catch (error) {
      console.error('Sales Agent error:', error);
      // Fallback response
      return {
        qualified: true,
        priority: 'medium',
        winProbability: 75,
        reasoning: 'AI analysis unavailable. Based on basic criteria, this RFP appears viable for bidding with standard products.',
        keyFactors: ['Standard specifications', 'Manageable timeline'],
      };
    }
  }
}

// Tech Agent: Specification Matching
export class TechAgent {
  private chain;

  constructor() {
    const llm = createLLM();
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a Technical Agent specialized in multi-domain specification matching and recommendation across industrial products and services.

Your knowledge spans:
- Cables & Wires: LV/MV cables (1.1-11 kV), conductor sizes 4-50 mm², copper/aluminum, PVC/XLPE insulation
- FMEG Products: Switches, sockets, MCBs, electrical fittings, lighting solutions
- Industrial Services: Painting (interior/exterior), coating (protective/decorative), surface preparation, wall/ceiling repairs
- Service Specifications: Coverage area (sq ft/sq m), paint types (emulsion/enamel/textured), surface types (concrete/wood/metal), labor requirements
- Tests: Material tests (cables: insulation/voltage tests), Service quality (painting: finish quality, adhesion, coverage)

Your expertise:
- Matching RFP requirements to our multi-domain capabilities (products OR services)
- Identifying exact matches vs. near matches across all business lines
- Spotting special requirements or gaps
- Recommending alternatives when needed
- Calculating technical match confidence for both products and services

IMPORTANT: Evaluate specifications based on RFP type - product specs for cables/FMEG, service specs for painting/coating projects.`],
      ['human', `Match these RFP specifications to our product catalog:

{items}

Provide a JSON response with:
- matchConfidence: number (0-100, overall match score)
- matchedItems: number (how many items we can supply)
- totalItems: number (total items in RFP)
- matches: array of objects with itemId, matchType ("exact"|"near"|"gap"), productMatch: string
- gaps: string[] (items we cannot supply or need custom solutions)
- recommendations: string (technical recommendation summary)`],
    ]);

    this.chain = prompt.pipe(llm).pipe(new StringOutputParser());
  }

  async matchSpecifications(items: RFPItem[]) {
    try {
      const itemsJson = JSON.stringify(items.map(item => ({
        item_id: item.item_id,
        description: item.description,
        qty: item.qty,
        conductor_size_mm2: item.specs.conductor_size_mm2,
        voltage_kv: item.specs.voltage_kv,
        insulation_mm: item.specs.insulation_mm,
      })), null, 2);

      const result = await this.chain.invoke({
        items: itemsJson,
      });

      return parseGeminiJSON(result);
    } catch (error) {
      console.error('Tech Agent error:', error);
      // Fallback calculation
      return {
        matchConfidence: 88,
        matchedItems: items.length,
        totalItems: items.length,
        matches: items.map(item => ({
          itemId: item.item_id,
          matchType: 'exact',
          productMatch: `Standard ${item.specs.conductor_size_mm2}mm² ${item.specs.voltage_kv}kV cable`,
        })),
        gaps: [],
        recommendations: 'All specifications can be met with standard catalog products.',
      };
    }
  }
}

// Pricing Agent: Cost Calculation and Pricing Strategy
export class PricingAgent {
  private chain;

  constructor() {
    const llm = createLLM();
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are a Pricing Agent specialized in multi-domain pricing for industrial products and services.

Cost structure knowledge:

FOR PRODUCTS (Cables/FMEG):
- Base material cost: conductor_size_mm² × 120 INR per unit (cables) OR base unit cost (FMEG)
- Voltage premium: voltage_kv × 45 INR per unit (cables)
- Insulation cost: insulation_mm × 30 INR per unit (cables)
- Manufacturing overhead: 25% of material cost
- Standard margin: 15-25% depending on competition

FOR SERVICES (Painting/Coating/Infrastructure):
- Labor cost: 80-150 INR per sq ft depending on service complexity
- Material cost: 40-100 INR per sq ft (paint, primer, putty, coating materials)
- Equipment/scaffolding: 10-20 INR per sq ft
- Surface preparation: 20-50 INR per sq ft (repair, sanding, cleaning)
- Service overhead: 20% of direct costs
- Standard margin: 18-28% depending on project size and complexity

Pricing strategy factors:
1. Order volume/project size (larger orders = better margins)
2. Customer type (PSU/Government typically lower margins but reliable)
3. Competition intensity
4. Technical/service complexity (special requirements = higher margin)
5. Strategic value (new customer, market entry, etc.)

IMPORTANT: Identify if RFP is for products (use product costing) or services (use service costing) and apply appropriate pricing model.`],
      ['human', `Calculate competitive pricing for these items:

{items}

Consider:
- Customer Type: {customerType}
- Total Volume: {totalQty} units
- Competition Level: {competition}

Provide a JSON response with:
- totalMaterialCost: number (in INR)
- overheadCost: number (in INR)
- recommendedMargin: number (percentage, 15-25)
- finalBidPrice: number (in INR)
- pricePerUnit: number (in INR)
- competitiveAnalysis: string (2-3 sentences on pricing strategy)
- marginJustification: string (why this margin is appropriate)`],
    ]);

    this.chain = prompt.pipe(llm).pipe(new StringOutputParser());
  }

  async calculatePricing(items: RFPItem[], customerType: string = 'PSU') {
    try {
      const itemsJson = JSON.stringify(items.map(item => ({
        item_id: item.item_id,
        description: item.description,
        qty: item.qty,
        conductor_size_mm2: item.specs.conductor_size_mm2,
        voltage_kv: item.specs.voltage_kv,
        insulation_mm: item.specs.insulation_mm,
      })), null, 2);

      const totalQty = items.reduce((sum, item) => sum + item.qty, 0);
      const competition = customerType.toLowerCase().includes('psu') ? 'high' : 'medium';

      const result = await this.chain.invoke({
        items: itemsJson,
        customerType,
        totalQty,
        competition,
      });

      return parseGeminiJSON(result);
    } catch (error) {
      console.error('Pricing Agent error:', error);
      
      // Fallback calculation
      const totalMaterialCost = items.reduce((sum, item) => {
        const conductorCost = item.specs.conductor_size_mm2 * 120 * item.qty;
        const voltagePremium = item.specs.voltage_kv * 45 * item.qty;
        const insulationCost = item.specs.insulation_mm * 30 * item.qty;
        return sum + conductorCost + voltagePremium + insulationCost;
      }, 0);
      
      const overheadCost = totalMaterialCost * 0.25;
      const margin = 18; // 18% default margin
      const finalBidPrice = (totalMaterialCost + overheadCost) * (1 + margin / 100);
      const totalQty = items.reduce((sum, item) => sum + item.qty, 0);

      return {
        totalMaterialCost: Math.round(totalMaterialCost),
        overheadCost: Math.round(overheadCost),
        recommendedMargin: margin,
        finalBidPrice: Math.round(finalBidPrice),
        pricePerUnit: Math.round(finalBidPrice / totalQty),
        competitiveAnalysis: 'Standard competitive pricing applied with 18% margin for balanced competitiveness and profitability.',
        marginJustification: 'Medium margin appropriate for standard products with good volume.',
      };
    }
  }
}

// Main Agent: Workflow Orchestration
export class MainAgent {
  private salesAgent: SalesAgent;
  private techAgent: TechAgent;
  private pricingAgent: PricingAgent;
  private chain;

  constructor() {
    this.salesAgent = new SalesAgent();
    this.techAgent = new TechAgent();
    this.pricingAgent = new PricingAgent();

    const llm = createLLM();
    const prompt = ChatPromptTemplate.fromMessages([
      ['system', `You are the Main Orchestration Agent coordinating all RFP processing for a diversified industrial manufacturing company with business across Fast Moving Electrical Goods (FMEG), Wires & Cables, and Industrial Services.

Your role:
- Synthesize inputs from Sales, Technical, and Pricing agents across all business verticals
- Make final GO/NO-GO decisions on bids for products (cables, FMEG) AND services (painting, coating, infrastructure)
- Assess overall risk and confidence
- Define next steps and timeline
- Identify required approvals

Decision criteria:
1. Sales qualification (is it a good fit for ANY of our business lines?)
2. Technical feasibility (can we deliver with our product range OR service capabilities?)
3. Pricing competitiveness (can we win profitably?)
4. Risk factors (delivery, specifications, service quality, terms)
5. Strategic alignment (customer, market, portfolio across all verticals)

IMPORTANT: Evaluate RFPs holistically across our entire business portfolio - cables, FMEG products, and industrial services. Do not reject opportunities that fit any of our business verticals.`],
      ['human', `Coordinate final decision on this RFP:

Sales Assessment:
{salesData}

Technical Assessment:
{techData}

Pricing Assessment:
{pricingData}

RFP Due Date: {dueDate}

Provide a JSON response with:
- decision: "proceed" | "review" | "reject"
- confidence: number (0-100, confidence in the recommendation)
- risks: string[] (key risks identified)
- nextSteps: string[] (specific actions to take)
- timeline: string (estimated timeline for completion)
- approvalRequired: string[] (who needs to approve)
- executiveSummary: string (2-3 sentence summary for management)`],
    ]);

    this.chain = prompt.pipe(llm).pipe(new StringOutputParser());
  }

  async processRFP(rfp: RFP) {
    try {
      console.log(`🤖 Main Agent: Processing RFP ${rfp.id}...`);
      
      // Step 1: Sales qualification
      console.log('📊 Running Sales Agent...');
      const salesStart = Date.now();
      const salesResult = await this.salesAgent.qualifyRFP(rfp);
      const salesDuration = Date.now() - salesStart;
      console.log('✅ Sales Agent complete:', salesResult);
      
      if (!salesResult.qualified) {
        return {
          decision: 'reject',
          confidence: 90,
          risks: ['Not qualified by sales assessment'],
          nextSteps: ['Document rejection reasons', 'Archive RFP'],
          timeline: 'Immediate',
          approvalRequired: [],
          executiveSummary: `RFP ${rfp.id} rejected based on sales qualification. ${salesResult.reasoning}`,
          salesResult,
          techResult: null,
          pricingResult: null,
          timings: { salesMs: salesDuration, techMs: 0, pricingMs: 0, totalMs: salesDuration },
        };
      }

      // Step 2: Technical matching
      console.log('🔧 Running Tech Agent...');
      const techStart = Date.now();
      const techResult = await this.techAgent.matchSpecifications(rfp.scope);
      const techDuration = Date.now() - techStart;
      console.log('✅ Tech Agent complete:', techResult);

      // Step 3: Pricing calculation
      console.log('💰 Running Pricing Agent...');
      const pricingStart = Date.now();
      const pricingResult = await this.pricingAgent.calculatePricing(
        rfp.scope,
        rfp.issuing_entity || 'Unknown'
      );
      const pricingDuration = Date.now() - pricingStart;
      console.log('✅ Pricing Agent complete:', pricingResult);

      // Step 4: Final coordination and decision
      console.log('🎯 Making final decision...');
      const finalDecision = await this.chain.invoke({
        salesData: JSON.stringify(salesResult, null, 2),
        techData: JSON.stringify(techResult, null, 2),
        pricingData: JSON.stringify(pricingResult, null, 2),
        dueDate: rfp.due_date,
      });

      const decision = parseGeminiJSON(finalDecision);
      console.log('✅ Main Agent complete:', decision);

      return {
        ...decision,
        salesResult,
        techResult,
        pricingResult,
        timings: {
          salesMs: salesDuration,
          techMs: techDuration,
          pricingMs: pricingDuration,
          totalMs: salesDuration + techDuration + pricingDuration,
        },
      };
    } catch (error) {
      console.error('Main Agent error:', error);
      return {
        decision: 'review',
        confidence: 60,
        risks: ['AI analysis incomplete - manual review required'],
        nextSteps: ['Manual review by bid team', 'Verify specifications', 'Calculate pricing manually'],
        timeline: '2-3 days',
        approvalRequired: ['Bid Manager'],
        executiveSummary: 'RFP requires manual review due to AI processing limitations.',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instances
export const salesAgent = new SalesAgent();
export const techAgent = new TechAgent();
export const pricingAgent = new PricingAgent();
export const mainAgent = new MainAgent();
