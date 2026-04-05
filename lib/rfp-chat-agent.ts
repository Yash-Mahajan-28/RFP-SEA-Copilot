import { Annotation, START, END, StateGraph } from '@langchain/langgraph';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { StringOutputParser } from '@langchain/core/output_parsers';
import type { RFP, RFPItem } from './rfpParser';

interface PerceptionStep {
  rfpId: string;
  rfpTitle: string;
  dueDate: string;
  issuingEntity: string;
  requirementSummary: string;
  relevantItems: Array<{
    itemId: number;
    description: string;
    qty: number;
  }>;
  knownTests: string[];
}

interface DecisionStep {
  intent: 'summary' | 'compliance' | 'pricing' | 'timeline' | 'risk' | 'clarification';
  rationale: string;
  confidence: number;
}

interface ActionStep {
  answer: string;
  nextActions: string[];
}

interface ChatAgentResult {
  answer: string;
  trace: {
    perception: PerceptionStep;
    decision: DecisionStep;
    action: ActionStep;
  };
}

function createLLM() {
  return new ChatGoogleGenerativeAI({
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.4'),
    apiKey: process.env.GEMINI_API_KEY,
  });
}

function parseGeminiJSON(text: string): Record<string, unknown> {
  let cleaned = text.trim();
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '');
  }

  const match = cleaned.match(/\{[\s\S]*\}/);
  return JSON.parse((match?.[0] || cleaned).trim()) as Record<string, unknown>;
}

function normalizeText(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9\s]/g, ' ');
}

function asString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback;
}

function asIntent(value: unknown): DecisionStep['intent'] {
  const allowed: DecisionStep['intent'][] = ['summary', 'compliance', 'pricing', 'timeline', 'risk', 'clarification'];
  if (typeof value === 'string' && allowed.includes(value as DecisionStep['intent'])) {
    return value as DecisionStep['intent'];
  }
  return 'clarification';
}

function pickRelevantItems(items: RFPItem[], query: string): PerceptionStep['relevantItems'] {
  const words = normalizeText(query)
    .split(/\s+/)
    .filter((w) => w.length > 2);

  const ranked = items
    .map((item) => {
      const text = normalizeText(item.description);
      const score = words.reduce((sum, w) => sum + (text.includes(w) ? 1 : 0), 0);
      return { item, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 4)
    .map(({ item }) => ({
      itemId: item.item_id,
      description: item.description,
      qty: item.qty,
    }));

  return ranked.length ? ranked : items.slice(0, 3).map((item) => ({
    itemId: item.item_id,
    description: item.description,
    qty: item.qty,
  }));
}

const ChatState = Annotation.Root({
  rfp: Annotation<RFP>(),
  userRequirement: Annotation<string>(),
  userQuestion: Annotation<string>(),
  perception: Annotation<PerceptionStep | null>(),
  decision: Annotation<DecisionStep | null>(),
  action: Annotation<ActionStep | null>(),
});

export class RfpChatbotAgent {
  private decisionChain;
  private actionChain;

  constructor() {
    const llm = createLLM();

    const decisionPrompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an RFP assistant planner. Decide how to answer the user using one intent.

Allowed intents: summary, compliance, pricing, timeline, risk, clarification.
Return strict JSON with:
- intent: one of allowed intents
- rationale: short reason in 1 sentence
- confidence: number 0-100`],
      ['human', `RFP title: {rfpTitle}
Requirement: {requirement}
User question: {question}
Relevant item snippets: {items}`],
    ]);

    this.decisionChain = decisionPrompt.pipe(llm).pipe(new StringOutputParser());

    const actionPrompt = ChatPromptTemplate.fromMessages([
      ['system', `You are an RFP chatbot for pre-bid support.
Answer only from provided RFP context and user requirement.
If context is insufficient, clearly state assumptions and ask one clarifying question.
Keep response concise and actionable.`],
      ['human', `RFP context:
- Title: {rfpTitle}
- Due date: {dueDate}
- Issuing entity: {entity}
- Requirement: {requirement}
- Decision intent: {intent}
- Decision rationale: {rationale}
- Relevant items: {items}
- Tests: {tests}

User question: {question}

Return strict JSON with:
- answer: string
- nextActions: string[] (max 3)`],
    ]);

    this.actionChain = actionPrompt.pipe(llm).pipe(new StringOutputParser());
  }

  async run(input: { rfp: RFP; userRequirement: string; userQuestion: string }): Promise<ChatAgentResult> {
    const graph = new StateGraph(ChatState)
      .addNode('perception_step', async (state) => {
        const combinedQuery = `${state.userRequirement} ${state.userQuestion}`;
        const perception: PerceptionStep = {
          rfpId: state.rfp.id,
          rfpTitle: state.rfp.title,
          dueDate: state.rfp.due_date,
          issuingEntity: state.rfp.issuing_entity || 'Unknown',
          requirementSummary: state.userRequirement,
          relevantItems: pickRelevantItems(state.rfp.scope || [], combinedQuery),
          knownTests: state.rfp.tests || [],
        };

        return { perception };
      })
      .addNode('decision_step', async (state) => {
        if (!process.env.GEMINI_API_KEY) {
          const fallback: DecisionStep = {
            intent: 'summary',
            rationale: 'LLM unavailable, using deterministic summary mode.',
            confidence: 55,
          };
          return { decision: fallback };
        }

        try {
          const raw = await this.decisionChain.invoke({
            rfpTitle: state.rfp.title,
            requirement: state.userRequirement,
            question: state.userQuestion,
            items: JSON.stringify(state.perception?.relevantItems || [], null, 2),
          });

          const parsed = parseGeminiJSON(raw);
          const decision: DecisionStep = {
            intent: asIntent(parsed.intent),
            rationale: asString(parsed.rationale, 'Selected best fit intent for the user query.'),
            confidence: Number(parsed.confidence || 70),
          };

          return { decision };
        } catch {
          const fallback: DecisionStep = {
            intent: 'clarification',
            rationale: 'Could not classify intent reliably; asking for precise scope.',
            confidence: 50,
          };
          return { decision: fallback };
        }
      })
      .addNode('action_step', async (state) => {
        if (!process.env.GEMINI_API_KEY) {
          const action: ActionStep = {
            answer: `Based on RFP ${state.rfp.id}, I found ${state.perception?.relevantItems.length || 0} relevant scope items for your requirement. Configure GEMINI_API_KEY for richer natural-language answers.`,
            nextActions: [
              'Confirm exact item IDs to quote',
              'Confirm compliance tests to include',
              'Draft bid response with commercial terms',
            ],
          };
          return { action };
        }

        try {
          const raw = await this.actionChain.invoke({
            rfpTitle: state.rfp.title,
            dueDate: state.rfp.due_date,
            entity: state.rfp.issuing_entity || 'Unknown',
            requirement: state.userRequirement,
            intent: state.decision?.intent || 'clarification',
            rationale: state.decision?.rationale || 'N/A',
            items: JSON.stringify(state.perception?.relevantItems || [], null, 2),
            tests: (state.rfp.tests || []).join(', ') || 'None provided',
            question: state.userQuestion,
          });

          const parsed = parseGeminiJSON(raw);
          const action: ActionStep = {
            answer: asString(parsed.answer, 'Unable to generate a precise answer.'),
            nextActions: Array.isArray(parsed.nextActions) ? parsed.nextActions.slice(0, 3) : [],
          };

          return { action };
        } catch {
          const action: ActionStep = {
            answer: 'I could not complete full reasoning for this question. Please refine your requirement or ask a narrower query.',
            nextActions: ['Clarify quantity/voltage constraints', 'Specify must-have compliance tests'],
          };
          return { action };
        }
      })
      .addEdge(START, 'perception_step')
      .addEdge('perception_step', 'decision_step')
      .addEdge('decision_step', 'action_step')
      .addEdge('action_step', END)
      .compile();

    const result = await graph.invoke({
      rfp: input.rfp,
      userRequirement: input.userRequirement,
      userQuestion: input.userQuestion,
      perception: null,
      decision: null,
      action: null,
    });

    return {
      answer: result.action?.answer || 'No answer generated.',
      trace: {
        perception: result.perception as PerceptionStep,
        decision: result.decision as DecisionStep,
        action: result.action as ActionStep,
      },
    };
  }
}

export const rfpChatbotAgent = new RfpChatbotAgent();
