# LangChain AI Agents Implementation

## Overview

This application uses **LangChain** with **OpenAI GPT-4** to power 4 specialized AI agents that automatically process RFPs end-to-end.

## Architecture

```
┌─────────────────┐
│   Main Agent    │  Orchestrates workflow & final decision
│  (Coordinator)  │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    │         │          │            │
┌───▼────┐ ┌─▼──────┐ ┌─▼─────────┐  │
│ Sales  │ │  Tech  │ │  Pricing  │  │
│ Agent  │ │ Agent  │ │  Agent    │  │
└────────┘ └────────┘ └───────────┘  │
    │         │            │          │
    └─────────┴────────────┴──────────┘
              Results
```

## The 4 AI Agents

### 1. Sales Agent (`SalesAgent`)
**Purpose**: RFP qualification and prioritization

**Powered by**: LangChain + GPT-4

**Analyzes**:
- Technical feasibility
- Buyer relationship (PSU vs Private)
- Project size and strategic value
- Competition level
- Timeline feasibility

**Outputs**:
```typescript
{
  qualified: boolean,
  priority: 'high' | 'medium' | 'low',
  winProbability: number, // 0-100
  reasoning: string,
  keyFactors: string[]
}
```

### 2. Tech Agent (`TechAgent`)
**Purpose**: Specification matching and product recommendation

**Powered by**: LangChain + GPT-4

**Analyzes**:
- Cable specifications (conductor size, voltage, insulation)
- Product catalog matching
- Technical gaps
- Alternative solutions

**Outputs**:
```typescript
{
  matchConfidence: number, // 0-100
  matchedItems: number,
  totalItems: number,
  matches: Array<{itemId, matchType, productMatch}>,
  gaps: string[],
  recommendations: string
}
```

### 3. Pricing Agent (`PricingAgent`)
**Purpose**: Cost calculation and competitive pricing

**Powered by**: LangChain + GPT-4

**Calculates**:
- Material costs (conductor, voltage premium, insulation)
- Manufacturing overhead (25% of material)
- Competitive margins (15-25%)
- Strategic pricing based on customer type and volume

**Outputs**:
```typescript
{
  totalMaterialCost: number,
  overheadCost: number,
  recommendedMargin: number,
  finalBidPrice: number,
  pricePerUnit: number,
  competitiveAnalysis: string,
  marginJustification: string
}
```

### 4. Main Agent (`MainAgent`)
**Purpose**: Workflow orchestration and final decision

**Powered by**: LangChain + GPT-4

**Coordinates**:
- Runs Sales, Tech, and Pricing agents in sequence
- Synthesizes all inputs
- Makes GO/NO-GO decision
- Defines next steps and timeline

**Outputs**:
```typescript
{
  decision: 'proceed' | 'review' | 'reject',
  confidence: number, // 0-100
  risks: string[],
  nextSteps: string[],
  timeline: string,
  approvalRequired: string[],
  executiveSummary: string,
  salesResult: {...},
  techResult: {...},
  pricingResult: {...}
}
```

## Setup Instructions

### 1. Get OpenAI API Key

1. Sign up at https://platform.openai.com/
2. Create an API key
3. Copy the key

### 2. Configure Environment

Edit `.env.local` in the project root:

```bash
# Required: Your OpenAI API key
OPENAI_API_KEY=sk-your-actual-key-here

# Optional: Model preferences
OPENAI_MODEL=gpt-4        # or gpt-3.5-turbo for faster/cheaper
OPENAI_TEMPERATURE=0.7    # 0.0-1.0, higher = more creative
```

### 3. Restart Development Server

```bash
npm run dev
```

The agents will automatically activate when a valid API key is detected.

## Usage

### Via Catalog Page

1. Go to **Catalog** page
2. Click on any RFP card to view details
3. Click **"🤖 Process with AI Agents"** button
4. Wait for AI processing (20-60 seconds)
5. View results in popup

### Via API

```bash
# Check agent status
curl http://localhost:3000/api/process-rfp

# Process an RFP
curl -X POST http://localhost:3000/api/process-rfp \
  -H "Content-Type: application/json" \
  -d '{"rfpId": "RFP-PSU-RE-2025-001"}'
```

### Response Example

```json
{
  "success": true,
  "rfpId": "RFP-PSU-RE-2025-001",
  "processingTime": 34521,
  "result": {
    "decision": "proceed",
    "confidence": 87,
    "risks": [
      "Tight delivery timeline",
      "High competition in PSU sector"
    ],
    "nextSteps": [
      "Prepare detailed technical proposal",
      "Confirm material availability",
      "Submit bid by due date"
    ],
    "timeline": "10-12 days for full proposal",
    "approvalRequired": ["Technical Manager", "Pricing Manager"],
    "executiveSummary": "Strong opportunity with 87% confidence. Technical specs match our catalog well. Recommended to proceed with competitive pricing strategy.",
    "salesResult": {
      "qualified": true,
      "priority": "high",
      "winProbability": 78,
      "reasoning": "Good fit for our LV cable portfolio, established PSU customer..."
    },
    "techResult": {
      "matchConfidence": 92,
      "matchedItems": 2,
      "totalItems": 2,
      "gaps": []
    },
    "pricingResult": {
      "totalMaterialCost": 4320000,
      "overheadCost": 1080000,
      "recommendedMargin": 17,
      "finalBidPrice": 6318000,
      "pricePerUnit": 743
    }
  }
}
```

## Cost Estimation

Using GPT-4:
- Sales Agent: ~1,500 tokens = $0.03
- Tech Agent: ~2,000 tokens = $0.04
- Pricing Agent: ~2,000 tokens = $0.04
- Main Agent: ~3,000 tokens = $0.06

**Total per RFP: ~$0.17** (prices as of Dec 2024)

Using GPT-3.5-turbo: ~$0.02 per RFP (much cheaper, slightly less accurate)

## Monitoring

Check console logs for detailed agent activity:

```
🚀 Processing RFP: RFP-PSU-RE-2025-001
📊 Running Sales Agent...
✅ Sales Agent complete: { qualified: true, priority: 'high', ... }
🔧 Running Tech Agent...
✅ Tech Agent complete: { matchConfidence: 92, ... }
💰 Running Pricing Agent...
✅ Pricing Agent complete: { finalBidPrice: 6318000, ... }
🎯 Making final decision...
✅ Main Agent complete: { decision: 'proceed', ... }
✅ Processing Complete (34521ms)
```

## Customization

### Adjust Agent Prompts

Edit `lib/langchain-agents.ts`:

```typescript
const prompt = ChatPromptTemplate.fromMessages([
  ['system', `Your custom system prompt here...`],
  ['human', `Your custom human prompt here with {variables}`],
]);
```

### Change Model

In `.env.local`:

```bash
OPENAI_MODEL=gpt-3.5-turbo  # Faster, cheaper
OPENAI_MODEL=gpt-4-turbo    # Latest, most capable
OPENAI_MODEL=gpt-4          # Standard
```

### Adjust Temperature

```bash
OPENAI_TEMPERATURE=0.3  # More deterministic
OPENAI_TEMPERATURE=0.7  # Balanced (default)
OPENAI_TEMPERATURE=0.9  # More creative
```

## Troubleshooting

### "API key not configured"

- Check `.env.local` exists in project root
- Verify `OPENAI_API_KEY` is set correctly
- Restart dev server after changes

### "Rate limit exceeded"

- OpenAI has rate limits on API calls
- Wait a minute and try again
- Consider upgrading your OpenAI plan

### "Model not found"

- Verify you have access to the model (GPT-4 requires special access)
- Try `gpt-3.5-turbo` instead
- Check your OpenAI account status

### Processing takes too long

- GPT-4 can take 30-60 seconds
- Switch to `gpt-3.5-turbo` for 10-20 seconds
- This is normal for AI processing

## Technology Stack

- **LangChain**: Agent framework and orchestration
- **@langchain/openai**: OpenAI integration
- **@langchain/core**: Core prompts and parsers
- **OpenAI GPT-4**: Language model
- **Next.js API Routes**: Backend endpoints
- **TypeScript**: Type safety

## Files

```
lib/
├── langchain-agents.ts      # 4 LangChain AI agents
├── agents.ts                # Legacy placeholder agents
└── rfpParser.ts             # RFP data parsing

app/api/
└── process-rfp/
    └── route.ts             # API endpoint for agent processing

.env.local                    # API keys (create this file)
```

## Next Steps

1. **Set your OpenAI API key** in `.env.local`
2. **Test the agents** using the Catalog page
3. **Monitor results** in browser console and terminal
4. **Customize prompts** based on your needs
5. **Scale up** with more RFPs from your sources

## Support

For issues or questions:
- Check console logs for detailed error messages
- Verify API key is valid at https://platform.openai.com/
- Review LangChain docs: https://js.langchain.com/
