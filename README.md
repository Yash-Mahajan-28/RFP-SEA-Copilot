# RFP-Copilot - Agentic AI RFP Automation Platform

Enterprise Grade Multi-Agent AI Platform for B2B RFP Response Automation in Manufacturing & Industrial Products (FMEG, Wires & Cables, Industrial Services)

---

## 🏢 Executive Summary

**RFP Copilot** is an enterprise-grade, multi-agent Agentic AI platform designed to revolutionize B2B RFP response processes for industrial manufacturers. Targeting the Manufacturing and Industrial Products sector—especially Fast Moving Electrical Goods (FMEG), Wires & Cables, and Industrial Services—our solution addresses critical bottlenecks that cost businesses valuable opportunities and revenue.

The platform serves three primary user groups: **Sales Teams** (RFP discovery and qualification), **Technical Teams** (specification matching and SKU recommendation), and **Pricing Teams** (cost estimation and competitive bid pricing). By automating manual, time-consuming processes that previously required sequential handoffs, RFP Copilot reduces response time from days to hours while improving accuracy and consistency.

**Output:** A web-based interactive platform powered by Google Gemini 2.5 Flash and LangChain, delivering real-time PDF parsing, advanced document extraction, intelligent multi-domain qualification, technical matching with confidence scoring, and adaptive pricing models. The system provides structured JSON outputs, comparison tables, win probability assessments, and consolidated bid packages ready for executive approval—all accessible via a modern Next.js 16 web interface with enterprise authentication and MongoDB Atlas storage.

**Live Demo:** [https://eyrfp-copilot.vercel.app](https://eyrfp-copilot.vercel.app)

---

## ❗ Problem Statement

**End User Pain Points:**

- Sales teams miss RFP opportunities due to scattered sources and slow fit assessment.
- Technical teams spend hours manually matching specs to SKUs, causing bottlenecks.
- Pricing teams wait for technical completion, leading to delays and inconsistent pricing.

**Business Goals:**

- Accelerate RFP response time and improve win rates.
- Automate manual, error-prone processes across sales, technical, and pricing departments.
- Provide explainable, data-driven recommendations and consolidated bid packages.

**Measured Impacts:**

- 90% of wins correlate with timely action.
- 60% of wins correlate with adequate technical team lead time.
- Technical SKU matching is the largest time consumer.

---

## 🧩 Solution Overview

RFP-Copilot employs a modular, multi-agent AI workflow that mirrors and enhances the human decision-making process. Each specialized agent handles domain-specific tasks, coordinated by a central orchestrator.

**Key Stages:**

1. **RFP Ingestion & Parsing:** Upload PDF, extract text, preprocess, and send to Gemini LLM.
2. **Structured Data Extraction:** Gemini AI extracts title, entity, due date, scope, specs, and test requirements as validated JSON.
3. **Multi-Agent Orchestration:**
   - Sales Agent: Multi-domain qualification, win probability, and fit assessment.
   - Technical Agent: Intelligent spec matching, SKU recommendations, and confidence scoring.
   - Pricing Agent: Adaptive pricing (product/service models), cost breakdown, and competitive analysis.
   - Main Agent: Orchestrates workflow, consolidates results, and generates GO/NO-GO recommendations.
4. **Decision Synthesis:** Main Agent consolidates all agent outputs, performs risk assessment, and produces an executive summary with next steps and timeline.
5. **Human-in-the-Loop Validation:** Users review, override, and approve final bid packages; all actions are logged in MongoDB Atlas.

**Architecture:**

- Next.js 16 (App Router), TypeScript, Tailwind CSS
- Google Gemini 2.5 Flash, LangChain, MongoDB Atlas
- Modular agent classes for Sales, Tech, Pricing, and Main orchestration
- Real-time PDF parsing, structured JSON output, and audit trails

---

## ✨ Key Features & Agents

### 🤖 Multi-Agent AI System (LangChain)

- **Sales Agent:** RFP discovery, qualification, win probability, and strategic fit assessment across cables, FMEG, and services.
- **Technical Agent:** Intelligent specification matcher for product and service specs, top 3 SKU recommendations, confidence scoring, and comparison tables.
- **Pricing Agent:** Adaptive pricing engine with dual models (product/service), cost breakdown, margin analysis, and competitive positioning.
- **Main Agent:** Central orchestrator that coordinates all agents, enforces workflows, logs decisions, and presents consolidated RFP responses.

### 📊 Real-Time Data & UI

- PDF upload and AI parsing (Gemini 2.5 Flash)
- Dynamic dashboard with calculated metrics
- Analytics, discovery, catalog, and agent configuration pages
- Modern, responsive UI (Tailwind CSS, Next.js 16)
- Cloud storage and audit trails (MongoDB Atlas)

### 🏭 Target Industry & Users

- Manufacturing / Industrial B2B (FMEG, Cables, Industrial Services)
- Sales, Technical Engineering, Pricing & Finance departments

---

### 📊 Pages Implemented:

1. **Login Page** (`/login`)

   - Email and password authentication
   - Role selection (Sales Lead, Technical Manager, Pricing Manager, System Administrator)
   - Modern, responsive design with black text fields

2. **Dashboard** (`/dashboard`)

   - **Real-time calculated metrics** from RFP source data:
     - RFPs Awaiting Review (dynamically counted)
     - Average Match Accuracy (calculated from specs completeness)
     - Catalog Coverage (percentage of items with complete specs)
     - Manual Overrides (items with special requirements)
   - Specification Matching Queue table with live RFP data
   - Dynamic trend indicators

3. **Analytics** (`/analytics`)

   - Win Rate Trends chart (6-month visualization)
   - RFP Source Effectiveness (calculated from actual sources)
   - Agent Performance Metrics with real percentages

4. **Discovery** (`/discovery`)

   - Automated RFP monitoring from multiple sources
   - Real-time source status indicators
   - Recent discoveries list with import functionality
   - Source-wise RFP count tracking

5. **Catalog** (`/catalog`)

   - Beautiful card-based RFP display
   - Detailed view modal with full specifications
   - Filterable RFP listings from HTML source
   - Interactive cards showing:
     - RFP ID and title
     - Due dates
     - Issuing entity and executor
     - Item counts and test requirements
     - Detailed specifications table

6. **Settings** (`/settings`)
   - AI Agent Configuration dashboard
   - Visual workflow diagram
   - Agent capability listings
   - Configuration and log access for each agent

## 🔧 Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **AI/Parsing:** LangChain, Cheerio
- **Data Source:** HTML parsing from `rfp_sources.html`
- **UI Components:** Custom components with modern design

## 🚀 Getting Started

### Installation

```bash
cd rfp-copilot
npm install
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser for local development.

Or try the deployed app directly: [https://eyrfp-copilot.vercel.app](https://eyrfp-copilot.vercel.app)

The app will redirect to the login page. After login, you'll be taken to the dashboard.

## 📁 Project Structure

```
rfp-copilot/
├── app/
│   ├── api/
│   │   └── rfps/              # API endpoint for RFP data
│   ├── dashboard/             # Dashboard with calculated metrics
│   ├── analytics/             # Analytics with real data
│   ├── discovery/             # RFP discovery and monitoring
│   ├── catalog/               # Beautiful RFP catalog view
│   ├── settings/              # AI agents configuration
│   ├── login/                 # Login page
│   ├── layout.tsx             # Root layout
│   └── page.tsx               # Home (redirects to login)
├── components/
│   ├── Sidebar.tsx            # Navigation sidebar (no top nav)
│   └── Header.tsx             # Top header with user actions only
├── lib/
│   ├── rfpParser.ts           # HTML parsing and metrics calculation
│   └── agents.ts              # AI agent definitions and processing
└── public/
    └── rfp_sources.html       # Source RFP data in HTML format
```

## 📊 Data Flow

1. **RFP Source (`rfp_sources.html`)**: Contains 3 RFPs in HTML format with embedded JSON
2. **Parser (`lib/rfpParser.ts`)**: Extracts and processes RFP data using Cheerio
3. **Metrics Calculation**: All metrics are calculated from actual data:
   - RFPs count, items count, match accuracy
   - Catalog coverage, manual overrides
   - Source-wise distribution
4. **Display**: Real-time data shown across all pages

## 🎯 Key Features

### ✅ No Placeholders

- All metrics are calculated from the actual RFP source file
- Dynamic data loading and processing
- Real-time statistics

### ✅ 4 AI Agents

- Sales Agent: Discovery & Qualification
- Tech Agent: Specification Matching
- Pricing Agent: Cost Calculation & Analysis
- Main Agent: Workflow Orchestration

### ✅ Beautiful UI

- Modern gradient cards
- Interactive modals
- Responsive design
- Clean navigation (sidebar only, no top nav bar)

### ✅ Data-Driven

- Parses HTML source with Cheerio
- Calculates metrics on the fly
- Shows real RFP details in catalog
- Dynamic due dates based on current date

## 🔄 How It Works

1. **Login**: Select role and authenticate
2. **Dashboard**: View calculated metrics and RFP queue
3. **Discovery**: Monitor sources and import new RFPs
4. **Catalog**: Browse RFPs in beautiful card layout
5. **Analytics**: See trends and source effectiveness
6. **Settings**: Configure AI agents

## 📝 License

Enterprise AI Platform for Industrial Manufacturers

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

**Deployed App:** [https://eyrfp-copilot.vercel.app](https://eyrfp-copilot.vercel.app)
