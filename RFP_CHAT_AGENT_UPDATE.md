# RFP Chat Agent Update Documentation

## 1. Summary
This update introduces a new RFP-specific chatbot powered by LangGraph and integrated into both backend and frontend.

The chatbot is designed to answer user questions for a selected RFP based on:
- User requirement (goal/context)
- User question (prompt)
- Parsed RFP data (title, scope, tests, due date, issuing entity)

It explicitly demonstrates three agent stages:
- Perception
- Decision
- Action

## 2. Why This Update Was Added
The goal was to provide a simple but production-usable chatbot agent that:
- Works for a specific RFP selected by the user
- Uses an explicit state-machine style workflow (LangGraph)
- Makes reasoning transparent by returning stage traces to the UI

This enables bid teams to ask requirement-focused pre-bid questions such as:
- Is this RFP worth pursuing?
- Does it match my compliance requirement?
- What should be the next bid actions?

## 3. Files Added/Updated

### Added
- app/api/rfp-chat/route.ts
  - New API endpoint for chat requests.
- lib/rfp-chat-agent.ts
  - LangGraph chatbot agent implementation.
- RFP_CHAT_AGENT_UPDATE.md
  - This documentation file.

### Updated
- app/test-agents/page.tsx
  - Replaced placeholder page with full Agent Chat UI.
- components/Sidebar.tsx
  - Added Agent Chat navigation item.
- package.json
  - Added @langchain/langgraph dependency.

## 4. Architecture Overview

### 4.1 Runtime Flow
1. User opens Agent Chat page.
2. UI fetches RFPs from /api/rfps.
3. User selects RFP, enters requirement and question.
4. UI calls POST /api/rfp-chat.
5. API loads RFP from static catalog or MongoDB upload collection.
6. API invokes LangGraph chatbot agent.
7. Agent executes Perception -> Decision -> Action.
8. API returns final answer and full trace.
9. UI renders assistant message plus trace cards.

### 4.2 High-Level Components
- Frontend page: app/test-agents/page.tsx
- API route: app/api/rfp-chat/route.ts
- Agent graph: lib/rfp-chat-agent.ts
- Data sources:
  - public/rfp_data.json (static)
  - MongoDB collection uploaded_rfps (uploaded)

## 5. Agent Design (LangGraph)

### 5.1 State Channels
The graph state includes:
- rfp
- userRequirement
- userQuestion
- perception
- decision
- action

### 5.2 Node Steps

#### Perception Step
Purpose:
- Build contextual understanding from RFP + user intent.

What it does:
- Combines userRequirement and userQuestion for relevance scoring.
- Selects top relevant scope items from RFP (keyword overlap).
- Stores requirement summary, known tests, due date, issuing entity.

Output channel:
- perception

#### Decision Step
Purpose:
- Decide response strategy.

What it does:
- Classifies intent into one of:
  - summary
  - compliance
  - pricing
  - timeline
  - risk
  - clarification
- Adds rationale and confidence score.
- Uses LLM when GEMINI_API_KEY exists.
- Falls back to deterministic decision when LLM is unavailable or parsing fails.

Output channel:
- decision

#### Action Step
Purpose:
- Produce user-facing answer and short next actions.

What it does:
- Uses RFP context + decision output + requirement + question.
- Returns concise answer and up to 3 next actions.
- Falls back to deterministic response if LLM is unavailable or fails.

Output channel:
- action

## 6. Critical Bug Fix Included

### 6.1 Error Seen
Runtime error:
- "perception is already being used as a state attribute (a.k.a. a channel), cannot also be used as a node name."

### 6.2 Root Cause
In LangGraph, node IDs cannot duplicate state channel names.
Initial implementation used node IDs matching channels:
- perception
- decision
- action

### 6.3 Fix Applied
Node IDs were renamed to unique values:
- perception_step
- decision_step
- action_step

State channels remained unchanged:
- perception
- decision
- action

Result:
- UI payload contract remained stable.
- Graph compiles and runs correctly.

## 7. API Contract

Endpoint:
- POST /api/rfp-chat

Request body:
- rfpId: string (required)
- userRequirement: string (required)
- question: string (required)

Success response:
- success: true
- rfpId
- rfpTitle
- durationMs
- answer
- trace:
  - perception
  - decision
  - action

Error cases:
- 400: missing required field
- 404: RFP not found
- 500: processing failure

Health check:
- GET /api/rfp-chat
- Returns online/configured status and workflow labels.

## 8. Frontend UX Details

Page:
- /test-agents

Features:
- RFP selector dropdown
- Requirement input textarea
- Question input textarea
- Ask Agent button with loading state
- Conversation history
- Trace cards per assistant response:
  - Perception card: relevant item count and IDs
  - Decision card: intent and confidence
  - Action card: next actions preview

## 9. Data Loading Rules

RFP lookup in API uses this order:
1. Static catalog (public/rfp_data.json)
2. MongoDB uploaded_rfps collection

If not found in either:
- returns 404 with "RFP not found"

## 10. Observability

The API attempts to log execution in MongoDB agent_logs with:
- rfpId
- rfpTitle
- durationMs
- requirement/question
- trace payload

If logging fails:
- API still returns successful chat response (non-blocking logging)

## 11. Setup and Run

1. Install dependencies
- npm install

2. Ensure environment variables
- GEMINI_API_KEY (recommended for full LLM responses)
- MONGODB_URI (optional for uploaded RFP lookup and logs)

3. Run app
- npm run dev

4. Open
- http://localhost:3000/test-agents

## 12. Verification Checklist

Functional checks:
- Agent Chat page loads and RFP selector populates.
- Chat request returns answer for selected RFP.
- Perception/Decision/Action trace renders.
- No LangGraph channel/node naming error.

Fallback checks:
- Without GEMINI_API_KEY, endpoint still returns deterministic answer.
- With no MongoDB, static RFP chat still works.

## 13. Known Constraints

- Lint baseline in repository includes many existing unrelated issues.
- Chat currently uses a single-turn server invocation with local message history on frontend.
- Relevant-item retrieval is keyword-based, not vector-search-based.

## 14. Suggested Next Enhancements

1. Multi-turn memory per RFP session (persisted in MongoDB).
2. Add retrieval augmentation (vector search over RFP clauses).
3. Add intent-specific action templates (compliance matrix, risk table, pricing sketch).
4. Add streaming responses for better perceived latency.
5. Add role-aware views (Sales/Technical/Pricing-specific prompt profiles).

## 15. Quick Troubleshooting

If the old error appears again:
1. Confirm node IDs in lib/rfp-chat-agent.ts are:
- perception_step
- decision_step
- action_step
2. Restart dev server (npm run dev).
3. Refresh browser cache/hard reload.

If answer quality is generic:
1. Check GEMINI_API_KEY in .env.local.
2. Increase requirement specificity.
3. Ask narrower question tied to quantity/spec/timeline.
