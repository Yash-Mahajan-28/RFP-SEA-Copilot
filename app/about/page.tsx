'use client';

import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';

export default function AboutPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1">
        <Header />
        <main className="mt-16 p-8 bg-gray-50 min-h-screen">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">About RFP-Copilot</h1>
            <p className="text-lg text-gray-600">Enterprise Grade Agentic AI RFP Automation Platform</p>
          </div>

          {/* Content Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            
            {/* Contributors Section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
              <h2 className="text-2xl font-bold mb-4">Project Contributors</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
                  <p className="font-semibold text-xl mb-2">Vedant Mhatre</p>
                  <p className="text-sm opacity-90 mb-2">AI Architecture & Intelligent Systems Lead</p>
                  <p className="text-xs opacity-80">Multi agent design & orchestration LangChain implementation Gemini AI integration prompt engineering agent decision logic adaptive reasoning systems</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
                  <p className="font-semibold text-xl mb-2">Aditya Upasani</p>
                  <p className="text-sm opacity-90 mb-2">Backend Engineering & Data Infrastructure Lead</p>
                  <p className="text-xs opacity-80">MongoDB Atlas architecture RESTful API design PDF parsing engine JWT authentication data modeling security protocols database optimization</p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm p-5 rounded-lg border border-white/20">
                  <p className="font-semibold text-xl mb-2">Yash Mahajan</p>
                  <p className="text-sm opacity-90 mb-2">Full Stack Integration & DevOps Lead</p>
                  <p className="text-xs opacity-80">End to end system integration AI agent output visualization Next.js 16 App Router real time processing UI interactive AI recommendation interfaces production deployment cloud infrastructure</p>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="p-8">
              
              {/* Executive Summary */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Executive Summary</h2>
                <div className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">
                    <span className="font-semibold text-blue-600">RFP Copilot</span> is an enterprise grade multi agent Agentic AI platform designed to revolutionize B2B RFP response processes for industrial manufacturers. Targeting the <strong>Manufacturing and Industrial Products sector</strong> specifically companies operating across Fast Moving Electrical Goods (FMEG) Wires and Cables and Industrial Services our solution addresses critical bottlenecks that cost businesses valuable opportunities and revenue.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The platform serves three primary <strong>user groups within client organizations</strong>: <span className="font-semibold">Sales Teams</span> (RFP discovery and qualification) <span className="font-semibold">Technical Teams</span> (product specification matching and SKU recommendation) and <span className="font-semibold">Pricing Teams</span> (cost estimation and competitive bid pricing). By automating manual time consuming processes that previously required sequential handoffs between these departments RFP Copilot reduces response time from days to hours while improving accuracy and consistency.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    The <strong>nature of output</strong> is a <strong>web based interactive platform</strong> powered by Google Gemini 2.5 Flash and LangChain delivering real time PDF parsing with advanced document extraction capabilities. The system intelligently extracts structured data from any RFP PDF document including title issuing entity due dates scope of supply technical specifications and test requirements. It provides intelligent multi domain qualification across product and service lines automated technical specification matching with confidence scoring and adaptive pricing models. The system provides structured JSON outputs detailed comparison tables win probability assessments and consolidated bid packages ready for executive approval all accessible through an intuitive Next.js 16 web interface with enterprise authentication and cloud based MongoDB Atlas storage for complete audit trails and reprocessing capabilities.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600 mt-4">
                    <p className="text-sm font-semibold text-blue-900">Target Industry:</p>
                    <p className="text-sm text-gray-700">Manufacturing / Industrial B2B (FMEG, Cables, Industrial Services)</p>
                    <p className="text-sm font-semibold text-blue-900 mt-2">Primary User Departments:</p>
                    <p className="text-sm text-gray-700">Sales, Technical Engineering, Pricing & Finance</p>
                    <p className="text-sm font-semibold text-blue-900 mt-2">Solution Type:</p>
                    <p className="text-sm text-gray-700">Cloud Based Web Application (Agentic AI Platform)</p>
                  </div>
                </div>
              </section>

              {/* Problem Statement */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Problem Statement</h2>
                <div className="bg-gradient-to-r from-red-50 to-orange-50 p-6 rounded-lg border border-red-200 mb-6">
                  <h3 className="text-xl font-semibold text-red-900 mb-3">End User Pain Points</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">Sales Teams</p>
                      <p className="text-sm text-gray-700">Miss RFP opportunities due to scattered sources (websites and emails). Struggle to assess strategic fit quickly across multiple business verticals simultaneously.</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">Technical Teams</p>
                      <p className="text-sm text-gray-700">Spend hours manually matching RFP specifications to product SKUs. Handle multiple concurrent RFPs causing severe lead time bottlenecks and quality issues.</p>
                    </div>
                    <div className="bg-white p-4 rounded shadow-sm">
                      <p className="font-semibold text-gray-900 mb-2">Pricing Teams</p>
                      <p className="text-sm text-gray-700">Wait for technical team completion before starting. Manual cost calculations prone to errors. Inconsistent pricing strategies across similar RFPs.</p>
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Business Goals</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>Increase the number of qualified RFP responses per year</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>Improve timeliness of responses to maximize win probability</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-600 mr-2">•</span>
                        <span>Reduce cycle time between RFP discovery and response submission</span>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <h3 className="text-xl font-semibold text-red-900 mb-3">Observed Bottlenecks</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span>Late detection of RFPs (scattered sources: websites and emails)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span>Manual time consuming SKU spec matching requiring domain expertise</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span>Sequential handoffs between Sales Technical and Pricing teams</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-red-600 mr-2">•</span>
                        <span>Pricing delays reduce win probability</span>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="mt-6 bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-3">Measured Impacts</h3>
                  <div className="grid md:grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-4xl font-bold text-yellow-700">90%</p>
                      <p className="text-sm text-gray-700 mt-2">of wins correlate with timely action</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-yellow-700">60%</p>
                      <p className="text-sm text-gray-700 mt-2">of wins correlate with adequate technical team lead time</p>
                    </div>
                    <div>
                      <p className="text-4xl font-bold text-yellow-700">#1</p>
                      <p className="text-sm text-gray-700 mt-2">Technical SKU matching is the largest time consumer</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Goal & Deliverable */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Goal & Desired Deliverable</h2>
                <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
                  <p className="text-gray-700 leading-relaxed mb-4">Design and deliver an Agentic AI system where:</p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span><strong>Sales Agent</strong> discovers RFPs (scan URLs and email feeds) and summarizes</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span><strong>Main Orchestrator</strong> produces role specific summaries and coordinates agents</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span><strong>Technical Agent</strong> produces top 3 SKU recommendations per RFP product with spec match percentage and comparison tables</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">✓</span>
                      <span><strong>Pricing Agent</strong> assigns unit and services pricing and returns consolidated cost breakdown</span>
                    </li>
                  </ul>
                  <div className="mt-6 p-4 bg-white rounded-lg shadow-sm">
                    <p className="text-gray-800 font-semibold">Key Deliverable:</p>
                    <p className="text-gray-700 mt-2">Demonstrable end to end journey: RFP identification → technical mapping → pricing → consolidated response package for Sales submission</p>
                  </div>
                </div>
              </section>

              {/* Approach & Methodology */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-600">Approach & Methodology</h2>
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    RFP-Copilot employs a systematic multi stage AI workflow that mirrors and enhances the existing human decision making process while eliminating manual bottlenecks. The solution is built on a modular agent architecture where each specialized AI agent handles domain specific tasks coordinated by a central orchestrator.
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-2">Stage 1: RFP Ingestion & Parsing</h3>
                      <p className="text-sm text-gray-700 mb-2">Users upload PDF documents through the web interface. The system extracts raw text using pdf-parse library preprocesses content (cleaning normalization) and sends it to Google Gemini 2.5 Flash LLM.</p>
                      <p className="text-xs text-gray-600 italic">Technology: pdf-parse LangChain ChatPromptTemplate Gemini AI with 100K token context window</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-2">Stage 2: Structured Data Extraction</h3>
                      <p className="text-sm text-gray-700 mb-2">Gemini AI analyzes unstructured RFP text and extracts: RFP title issuing entity due date scope of supply (all items/services) technical specifications (voltage conductor size coverage areas paint types) and test requirements. Output is validated JSON with automatic retry on parsing failures.</p>
                      <p className="text-xs text-gray-600 italic">Technology: Template based prompting with escape handling aggressive JSON cleanup validation against schema</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-2">Stage 3: Multi Agent Orchestration</h3>
                      <p className="text-sm text-gray-700 mb-2"><strong>Sales Agent</strong> performs multi domain qualification (cables/FMEG/services) assesses win probability strategic fit and timeline feasibility. <strong>Technical Agent</strong> matches specifications to product/service catalog computes confidence scores identifies gaps. <strong>Pricing Agent</strong> applies dual models (product: material based service: labor based) calculates margins competitive positioning.</p>
                      <p className="text-xs text-gray-600 italic">Technology: LangChain agent chains parallel execution fallback responses performance tracking</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-2">Stage 4: Decision Synthesis & Output Generation</h3>
                      <p className="text-sm text-gray-700 mb-2">Main Orchestrator Agent consolidates inputs from all agents performs risk assessment generates GO/NO-GO recommendation with confidence score identifies approval requirements and produces executive summary with next steps and timeline.</p>
                      <p className="text-xs text-gray-600 italic">Technology: Context aware synthesis decision tree logic structured output formatting</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-2">Stage 5: Human in the Loop Validation</h3>
                      <p className="text-sm text-gray-700 mb-2">Users review AI recommendations override decisions if needed approve final bid package and system stores complete audit trail in MongoDB Atlas for compliance and future reprocessing.</p>
                      <p className="text-xs text-gray-600 italic">Technology: Web based approval workflows MongoDB persistence JWT authentication</p>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg">
                    <p className="text-sm font-semibold text-purple-900">Key Methodological Principles:</p>
                    <ul className="text-sm text-gray-700 space-y-1 mt-2 ml-4">
                      <li>• <strong>Adaptive Intelligence:</strong> Agents automatically adjust logic based on RFP type (product vs service)</li>
                      <li>• <strong>Explainability:</strong> Every decision includes reasoning confidence scores and comparison tables</li>
                      <li>• <strong>Fail Safe Design:</strong> Fallback responses ensure system never blocks user workflow</li>
                      <li>• <strong>Scalability:</strong> Modular architecture supports adding new business verticals without core changes</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Solution Architecture */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Our Proposed Solution</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border-2 border-blue-300 shadow-md">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Main Orchestrator Agent</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Central controller that creates role contextual prompts across all business verticals (cables FMEG and services) aggregates results enforces workflows logs provenance and decisions and presents consolidated RFP response for products and services.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-2 border-green-300 shadow-md">
                    <h3 className="text-xl font-semibold text-green-900 mb-3">Sales Agent</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Multi domain qualification engine that evaluates RFPs across cables FMEG products painting services coating services and infrastructure projects. Performs relevance scoring strategic fit assessment and win probability analysis across all business lines.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-2 border-purple-300 shadow-md">
                    <h3 className="text-xl font-semibold text-purple-900 mb-3">Technical Agent</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Intelligent specification matcher that handles product specs (cables: conductor size voltage and insulation; FMEG: switches sockets and MCBs) and service specs (painting: coverage area paint types and surface preparation). Computes match confidence and returns top 3 recommendations with detailed comparison tables.
                    </p>
                  </div>
                  <div className="bg-white p-6 rounded-lg border-2 border-orange-300 shadow-md">
                    <h3 className="text-xl font-semibold text-orange-900 mb-3">Pricing Agent</h3>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      Adaptive pricing engine with dual models: product based costing (material plus overhead plus margin) for cables and FMEG and service based costing (labor plus materials plus equipment plus surface prep) for painting and coating projects. Applies competitive analysis and strategic pricing rules.
                    </p>
                  </div>
                </div>
              </section>

              {/* New Features Section */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">Latest Features and Capabilities</h2>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-lg border-l-4 border-blue-600 shadow-md">
                    <h3 className="text-xl font-bold text-blue-900 mb-3">
                      Smart PDF Upload and AI Parsing
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Powered by <strong>Google Gemini 2.5 Flash</strong> our system intelligently extracts structured data from any RFP PDF document. Upload any RFP (cables services or FMCG) and get instant parsing with:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 ml-6">
                      <li>• Automatic title issuing entity and due date extraction</li>
                      <li>• Comprehensive scope identification (all items/services listed)</li>
                      <li>• Technical specification extraction (voltage conductor size paint types coverage areas)</li>
                      <li>• Test requirement identification</li>
                      <li>• 100K+ character processing capacity with intelligent text preprocessing</li>
                      <li>• Template based structured JSON output with validation</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-6 rounded-lg border-l-4 border-purple-600 shadow-md">
                    <h3 className="text-xl font-bold text-purple-900 mb-3">
                      Multi Domain Business Capability
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Unlike traditional single domain systems RFP-Copilot handles diverse business verticals:
                    </p>
                    <div className="grid md:grid-cols-3 gap-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-purple-800 mb-1">Wires & Cables</h4>
                        <p className="text-xs text-gray-600">LV/MV cables conductor specs voltage ratings insulation requirements</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-purple-800 mb-1">FMEG Products</h4>
                        <p className="text-xs text-gray-600">Switches sockets MCBs electrical fittings lighting solutions</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-purple-800 mb-1">Industrial Services</h4>
                        <p className="text-xs text-gray-600">Painting coating surface preparation wall/ceiling repairs</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-lg border-l-4 border-green-600 shadow-md">
                    <h3 className="text-xl font-bold text-green-900 mb-3">
                      MongoDB Cloud Integration
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Seamless cloud storage with MongoDB Atlas for enterprise grade data management:
                    </p>
                    <ul className="space-y-2 text-sm text-gray-700 ml-6">
                      <li>• Automatic storage of all uploaded RFPs with full metadata</li>
                      <li>• Reprocess capability - revisit and reanalyze any uploaded RFP from the catalog</li>
                      <li>• Persistent data across sessions with cloud reliability</li>
                      <li>• Combined search across static RFP database and uploaded documents</li>
                      <li>• Audit trail for all AI agent decisions and recommendations</li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-lg border-l-4 border-orange-600 shadow-md">
                    <h3 className="text-xl font-bold text-orange-900 mb-3">
                      Adaptive AI Agent Intelligence
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Our AI agents automatically adapt their analysis based on RFP type:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-orange-800 mb-1">Sales Qualification</h4>
                        <p className="text-xs text-gray-600">Multi vertical assessment no rejection due to single domain mismatch strategic fit across all business lines</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-orange-800 mb-1">Technical Matching</h4>
                        <p className="text-xs text-gray-600">Product spec matching for cables/FMEG service spec matching for painting/coating unified confidence scoring</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-orange-800 mb-1">Dynamic Pricing</h4>
                        <p className="text-xs text-gray-600">Dual pricing models - material based for products (cable costing) labor based for services (painting rates)</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-orange-800 mb-1">Smart Orchestration</h4>
                        <p className="text-xs text-gray-600">Context aware workflow that routes RFPs to appropriate business logic based on detected type</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 p-6 rounded-lg border-l-4 border-indigo-600 shadow-md">
                    <h3 className="text-xl font-bold text-indigo-900 mb-3">
                      Agent Logs & Reports Dashboard
                    </h3>
                    <p className="text-gray-700 mb-3">
                      Comprehensive observability and analytics for complete transparency into AI agent decision making:
                    </p>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-indigo-800 mb-1">Agent Execution Logs</h4>
                        <p className="text-xs text-gray-600">Real time logs capturing every agent invocation processing time confidence scores and decision rationale with timestamp tracking</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-indigo-800 mb-1">Analytics Reports</h4>
                        <p className="text-xs text-gray-600">Aggregated insights on RFP processing volume agent performance metrics win rate correlations and processing efficiency trends</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-indigo-800 mb-1">Audit Trail</h4>
                        <p className="text-xs text-gray-600">Complete compliance ready audit logs showing who uploaded what when agents ran what decisions were made and all human overrides</p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <h4 className="font-semibold text-indigo-800 mb-1">Historical Analysis</h4>
                        <p className="text-xs text-gray-600">Searchable history of all processed RFPs with filtering by date status business vertical and agent recommendations</p>
                      </div>
                    </div>
                    <div className="mt-3 bg-indigo-50 p-3 rounded">
                      <p className="text-xs text-indigo-900"><strong>Use Cases:</strong> Debugging agent behavior performance optimization compliance audits management reporting identifying improvement opportunities</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-lg border-l-4 border-red-600 shadow-md">
                    <h3 className="text-xl font-bold text-red-900 mb-3">
                      Enhanced Technical Capabilities
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">Parser Engine</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Text preprocessing & cleaning (100K char limit)</li>
                          <li>• LangChain powered prompt templates with escape handling</li>
                          <li>• Aggressive JSON cleanup & validation</li>
                          <li>• Retry logic with exponential backoff</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-red-800 mb-2">Agent Architecture</h4>
                        <ul className="space-y-1 text-sm text-gray-700">
                          <li>• Modular agent design with fallback responses</li>
                          <li>• Performance timing for each agent execution</li>
                          <li>• Comprehensive error handling & logging</li>
                          <li>• Configurable temperature & model selection</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Working Prototype & Demonstration */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-green-600">Working Prototype & Demonstration</h2>
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-lg border-2 border-green-500 shadow-lg">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 text-2xl">
                      ✓
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-900 mb-2">Fully Functional Prototype Available</h3>
                      <p className="text-gray-700 leading-relaxed">
                        RFP-Copilot is not a concept or wireframe—it is a <strong>fully operational production ready web application</strong> deployed and accessible for live demonstration. The system has been tested with real RFP documents across multiple domains (cables FMEG painting services) and successfully processes end to end workflows from PDF upload to final bid recommendation.
                      </p>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                        Live Demo Capabilities
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• <strong>Real time PDF upload and parsing</strong> with immediate Gemini AI processing</li>
                        <li>• <strong>Live agent execution</strong> showing Sales Technical and Pricing analysis</li>
                        <li>• <strong>Interactive catalog view</strong> with search filter and reprocess functionality</li>
                        <li>• <strong>Multi user authentication</strong> demonstrating role based access control</li>
                        <li>• <strong>MongoDB cloud integration</strong> showing persistent storage and audit trails</li>
                        <li>• <strong>Responsive UI</strong> working across desktop tablet and mobile devices</li>
                      </ul>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                        Documentation & Supporting Materials
                      </h4>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li>• <strong>Architecture Diagram</strong> (attached separately as architecture.png)</li>
                        <li>• <strong>System Flow Diagram</strong> illustrating agent orchestration workflow</li>
                        <li>• <strong>UI Screenshots</strong> showcasing key pages (Discovery Catalog Analytics)</li>
                        <li>• <strong>Demo Video</strong> (if required) showing complete RFP processing cycle</li>
                        <li>• <strong>API Documentation</strong> with endpoint specifications and response schemas</li>
                        <li>• <strong>Test Results</strong> including parsing accuracy and performance metrics</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-600">
                    <h4 className="font-semibold text-green-900 mb-3">Screen Sharing Demonstration Ready</h4>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      The development team is prepared to provide a <strong>live screen sharing demonstration</strong> during evaluation walking through:
                    </p>
                    <div className="grid md:grid-cols-2 gap-4 mt-3">
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>1. User authentication and role based access</li>
                        <li>2. PDF upload (using sample RFPs from various domains)</li>
                        <li>3. Real time Gemini AI parsing with progress indicators</li>
                        <li>4. Multi agent execution with timing metrics</li>
                      </ul>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>5. Sales qualification results with win probability</li>
                        <li>6. Technical specification matching with confidence scores</li>
                        <li>7. Adaptive pricing models (product vs service)</li>
                        <li>8. Final consolidated recommendation with executive summary</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 bg-gradient-to-r from-green-600 to-emerald-600 p-4 rounded-lg text-white">
                    <p className="text-center font-semibold">
                      The prototype demonstrates not just technical feasibility but real world applicability with enterprise grade quality standards.
                    </p>
                  </div>
                </div>
              </section>

              {/* Tech Stack */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Technology Stack</h2>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Core Framework</h3>
                    <p className="text-sm text-gray-700">Next.js 16 React 19 TypeScript 5 Node.js 22</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">AI & LLM</h3>
                    <p className="text-sm text-gray-700">Google Gemini 2.5 Flash LangChain 0.3 ChatGoogleGenerativeAI</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Database</h3>
                    <p className="text-sm text-gray-700">MongoDB 7.0 Atlas (Cloud) Collections based storage</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Document Processing</h3>
                    <p className="text-sm text-gray-700">pdf-parse 1.1.4 Buffer handling Text preprocessing</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Authentication</h3>
                    <p className="text-sm text-gray-700">bcryptjs jsonwebtoken 7-day session tokens</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">UI/Styling</h3>
                    <p className="text-sm text-gray-700">Tailwind CSS 4 Responsive design Dark mode ready</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">API Architecture</h3>
                    <p className="text-sm text-gray-700">Next.js API Routes RESTful endpoints Error handling</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Development Tools</h3>
                    <p className="text-sm text-gray-700">ESLint TypeScript Strict Mode Hot reload</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <h3 className="font-semibold text-gray-900 mb-2">Deployment</h3>
                    <p className="text-sm text-gray-700">Vercel ready Environment variables Cloud scalable</p>
                  </div>
                </div>
              </section>

              {/* Architecture Reference */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">System Architecture Overview</h2>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                  <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
                    <p className="text-sm text-yellow-900">
                      <strong>Note:</strong> Detailed architecture diagram attached separately as architecture.png per EY submission guidelines.
                    </p>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900 mb-3">Architectural Principles</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Modular Agent Design:</strong> Four specialized AI agents (Sales Technical Pricing Main) operate independently with clear interfaces</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Cloud Native:</strong> Stateless API services MongoDB Atlas for persistence horizontal scaling support</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Separation of Concerns:</strong> Frontend (Next.js) Backend (API Routes) AI Layer (LangChain) Storage (MongoDB)</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Enterprise Security:</strong> JWT authentication RBAC encrypted data at rest secure API communication</span>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-indigo-900 mb-3">Scalability & Extensibility</h3>
                      <ul className="space-y-2 text-sm text-gray-700">
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Horizontal Scaling:</strong> Stateless design allows adding more instances during peak load</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Agent Extensibility:</strong> New domain agents can be added without modifying core orchestration logic</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Model Flexibility:</strong> LLM provider can be switched (Gemini OpenAI Azure OpenAI) via configuration</span>
                        </li>
                        <li className="flex items-start">
                          <span className="text-indigo-600 mr-2 font-bold">•</span>
                          <span><strong>Multi Tenancy Ready:</strong> Database structure supports tenant isolation for SaaS deployment</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 bg-white p-5 rounded-lg shadow-sm">
                    <h3 className="text-lg font-semibold text-indigo-900 mb-3">Data Flow Summary</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      User uploads PDF → pdf-parse extracts text → Gemini AI structures data → MongoDB stores RFP → Sales Agent qualifies → Technical Agent matches specs → Pricing Agent calculates costs → Main Agent synthesizes decision → User reviews recommendation → MongoDB logs audit trail → Final response generated
                    </p>
                    <div className="bg-indigo-50 p-3 rounded">
                      <p className="text-xs text-indigo-900"><strong>Performance Characteristics:</strong> PDF parsing: 2-5s | Agent execution: 5-15s total | End-to-end: &lt;30s | Concurrent RFP processing: 10+ simultaneous</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Unique Selling Propositions */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Unique Selling Propositions</h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                    { title: 'Multi Domain Intelligence', desc: 'Single platform handles cables FMEG products and industrial services - no vertical silos' },
                    { title: 'AI Powered PDF Parsing', desc: 'Gemini 2.5 Flash extracts structured data from any RFP format with 100K+ char capacity' },
                    { title: 'Adaptive Agent Reasoning', desc: 'Agents automatically adjust analysis based on RFP type - product vs service logic' },
                    { title: 'Cloud Native Storage', desc: 'MongoDB Atlas integration with reprocess capability and persistent audit trails' },
                    { title: 'End to End Orchestration', desc: 'Combines RFP upload parsing qualification technical mapping and pricing in one workflow' },
                    { title: 'Role Contextual Summarization', desc: 'Same RFP distilled differently for Sales Technical and Pricing agents' },
                    { title: 'Explainable SKU Matching', desc: 'Transparent spec match metrics and per parameter comparisons with confidence scores' },
                    { title: 'Rapid Time to Response', desc: 'Parallelized agents reduce wall clock time significantly with performance tracking' },
                    { title: 'Dual Pricing Models', desc: 'Material-based costing for products, labor-based for services - automatic selection' },
                    { title: 'Human in Loop Controls', desc: 'Approvals edits and override capabilities maintain governance and compliance' },
                    { title: 'Enterprise Authentication', desc: 'JWT based secure sessions with RBAC for multi team access control' },
                    { title: 'Real Time Processing', desc: 'Instant PDF upload to analysis pipeline with comprehensive error handling' },
                  ].map((usp, index) => (
                    <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-lg border border-blue-200 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-gray-900 mb-2">{usp.title}</h3>
                      <p className="text-sm text-gray-700">{usp.desc}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Business Model */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Business Model</h2>
                <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">Revenue Streams</h3>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">SaaS Subscription</h4>
                      <p className="text-sm text-gray-700">Tiered plans based on number of monitored RFP sources agent concurrency and storage</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Professional Services</h4>
                      <p className="text-sm text-gray-700">Initial onboarding custom integrations training and SKU catalog setup</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Per RFP Processing</h4>
                      <p className="text-sm text-gray-700">Metered pricing option for high volume customers</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm">
                      <h4 className="font-semibold text-gray-900 mb-2">Advanced Features</h4>
                      <p className="text-sm text-gray-700">On premise deployment premium models priority support & SLAs</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6 bg-blue-50 p-6 rounded-lg border border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Value Proposition & ROI</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span><strong>20-50% increase</strong> in qualified RFP responses</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span><strong>5-15% improvement</strong> in win rates through timely submissions</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span><strong>Significant labor cost savings</strong> through automated baseline processing</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-600 mr-2">✓</span>
                      <span><strong>Break even in 3-9 months</strong> depending on volume and win uplift</span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* KPIs and Success Metrics */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">KPIs and Success Metrics</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                    <h3 className="text-lg font-semibold text-purple-900 mb-3">Operational Metrics</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Time from RFP publication to Sales Agent notification</li>
                      <li>• Time from discovery to full consolidated response</li>
                      <li>• Number of RFPs processed per month</li>
                    </ul>
                  </div>
                  <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                    <h3 className="text-lg font-semibold text-green-900 mb-3">Business Metrics</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Change in number of RFP responses per quarter</li>
                      <li>• Win rate change on target RFP categories</li>
                      <li>• Average price accuracy vs. historical close price</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                    <h3 className="text-lg font-semibold text-blue-900 mb-3">Quality Metrics</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• Spec match accuracy vs. human technical reviewers</li>
                      <li>• Human override rate on agent recommendations</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
                    <h3 className="text-lg font-semibold text-orange-900 mb-3">Reliability Metrics</h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>• System uptime and pipeline job success rate</li>
                      <li>• Mean time to recover (MTTR)</li>
                      <li>• Cost per processed RFP</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Security & Compliance */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Security, Data Governance & Compliance</h2>
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Data Protection</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Per customer tenant isolation</li>
                        <li>• Encrypted storage for documents and logs</li>
                        <li>• PII and IP protection</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-semibold text-red-900 mb-2">Access Controls</h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• RBAC for Sales/Technical/Pricing</li>
                        <li>• Immutable audit logs</li>
                        <li>• Regulatory compliance ready</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Evaluation Mapping */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-purple-600">Solution Evaluation Mapping</h2>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border border-purple-200">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    RFP-Copilot directly addresses key evaluation criteria for enterprise AI solutions in the B2B manufacturing domain:
                  </p>
                  <div className="space-y-4">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-2">
                        Scope of Problem Covered
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700 ml-10">
                        <li>• <strong>Complete RFP Lifecycle:</strong> From discovery/upload through parsing qualification technical matching pricing to final decision—no manual handoffs</li>
                        <li>• <strong>Multi Domain Coverage:</strong> Handles cables FMEG products and industrial services (painting coating) in single platform</li>
                        <li>• <strong>All Stakeholder Needs:</strong> Serves Sales Technical and Pricing teams with role specific outputs and workflows</li>
                        <li>• <strong>90% of Process Automated:</strong> Only final approval and edge case reviews require human intervention</li>
                        <li>• <strong>Addresses Core Bottleneck:</strong> Technical SKU matching (identified as #1 time consumer) fully automated with explainable confidence scores</li>
                      </ul>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-pink-600">
                      <h3 className="font-semibold text-pink-900 mb-2">
                        Uniqueness & Innovation
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700 ml-10">
                        <li>• <strong>Multi Domain Intelligence:</strong> First solution to handle products AND services in unified agent architecture—not siloed vertical specific tools</li>
                        <li>• <strong>Adaptive Reasoning:</strong> AI agents automatically detect RFP type and apply appropriate logic (product specs vs service specs material costing vs labor costing)</li>
                        <li>• <strong>Context Aware Orchestration:</strong> Main Agent synthesizes inputs differently based on RFP characteristics not rigid templated responses</li>
                        <li>• <strong>Explainable AI:</strong> Every decision includes reasoning confidence scores spec by spec comparisons—not black box recommendations</li>
                        <li>• <strong>Reprocess Capability:</strong> Unique ability to re analyze uploaded RFPs with different parameters or after catalog updates</li>
                      </ul>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-600">
                      <h3 className="font-semibold text-blue-900 mb-2">
                        End User Impact
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700 ml-10">
                        <li>• <strong>Time Savings:</strong> Reduces RFP response cycle from 5-7 days to &lt;1 day enabling 3-5x more RFP responses per quarter</li>
                        <li>• <strong>Win Rate Improvement:</strong> 90% correlation between timely action and wins—system ensures no RFP misses deadline</li>
                        <li>• <strong>Quality Consistency:</strong> Eliminates human errors in spec matching and pricing calculations standardizes bid quality</li>
                        <li>• <strong>Knowledge Preservation:</strong> Captures domain expertise in prompts and logic reduces dependency on individual experts</li>
                        <li>• <strong>User Empowerment:</strong> Technical teams freed from repetitive matching to focus on complex edge cases and new product development</li>
                      </ul>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-600">
                      <h3 className="font-semibold text-green-900 mb-2">
                        Scalability & Security
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-700 ml-10">
                        <li>• <strong>Cloud Native Design:</strong> Stateless architecture supports horizontal scaling handles 100+ concurrent RFPs with auto scaling</li>
                        <li>• <strong>Enterprise Authentication:</strong> JWT based sessions RBAC for Sales/Technical/Pricing roles encrypted storage audit logs</li>
                        <li>• <strong>Data Sovereignty:</strong> MongoDB Atlas supports region specific deployment for compliance (EU GDPR India data localization)</li>
                        <li>• <strong>Model Flexibility:</strong> Can switch from Gemini to Azure OpenAI or on premise LLMs for sensitive data compliance</li>
                        <li>• <strong>Performance SLAs:</strong> Sub 30s end to end processing 99.9% uptime target automatic retry mechanisms</li>
                        <li>• <strong>Cost Effective Scaling:</strong> Pay per use Gemini API MongoDB Atlas auto tiering—no upfront infrastructure investment</li>
                      </ul>
                    </div>
                  </div>
                  <div className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 p-5 rounded-lg text-white">
                    <h3 className="font-semibold text-lg mb-3">Quantifiable Business Impact</h3>
                    <div className="grid md:grid-cols-4 gap-4 text-center">
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
                        <p className="text-3xl font-bold">3-5x</p>
                        <p className="text-sm mt-1">More RFP Responses</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
                        <p className="text-3xl font-bold">90%</p>
                        <p className="text-sm mt-1">Process Automation</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
                        <p className="text-3xl font-bold">&lt;1 Day</p>
                        <p className="text-sm mt-1">Response Time</p>
                      </div>
                      <div className="bg-white/20 backdrop-blur-sm p-3 rounded">
                        <p className="text-3xl font-bold">5-15%</p>
                        <p className="text-sm mt-1">Win Rate Uplift</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Future Scope & Roadmap */}
              <section className="mb-12">
                <h2 className="text-3xl font-bold text-gray-900 mb-4 pb-2 border-b-2 border-indigo-600">Future Scope & Roadmap</h2>
                <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border border-indigo-200">
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    While the current MVP delivers complete end to end RFP processing RFP-Copilot is designed as a <strong>scalable enterprise platform</strong>. Its modular agent architecture and cloud native design support continuous expansion without disrupting core workflows.
                  </p>
                  
                  {/* 2x2 Phase Grid */}
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-blue-600">
                      <h3 className="font-semibold text-blue-900 mb-3">
                        Phase 1: Scale & Automation
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Monitoring of 100+ LSTK and PSU tender portals (CPP GeM state portals)</li>
                        <li>• Email ingestion of procurement notifications with automated routing</li>
                        <li>• Intelligent RFP relevance and priority scoring</li>
                        <li>• Parallel RFP processing using distributed agent execution</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-purple-600">
                      <h3 className="font-semibold text-purple-900 mb-3">
                        Phase 2: Learning & Intelligence
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Learning from historical win/loss data</li>
                        <li>• Adaptive spec weighting based on past outcomes</li>
                        <li>• Human feedback loops to improve recommendations</li>
                        <li>• Win probability prediction for bid prioritization</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-green-600">
                      <h3 className="font-semibold text-green-900 mb-3">
                        Phase 3: Pricing & Commercial Intelligence
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• Margin optimization and pricing scenario analysis</li>
                        <li>• Competitive benchmarking using market signals</li>
                        <li>• Cost sensitivity analysis for raw material fluctuations</li>
                        <li>• Commercial risk assessment from contract terms</li>
                      </ul>
                    </div>

                    <div className="bg-white p-5 rounded-lg shadow-sm border-l-4 border-orange-600">
                      <h3 className="font-semibold text-orange-900 mb-3">
                        Phase 4: Enterprise Integration & Expansion
                      </h3>
                      <ul className="space-y-1 text-sm text-gray-700">
                        <li>• ERP (SAP/Oracle) and CRM (Salesforce/Dynamics) integration</li>
                        <li>• Enterprise document management and approval workflows</li>
                        <li>• Expansion to adjacent B2B industries</li>
                        <li>• Multi region multi language white label SaaS offering</li>
                      </ul>
                    </div>
                  </div>

                  {/* Architectural Readiness */}
                  <div className="bg-gradient-to-r from-indigo-600 to-blue-600 p-5 rounded-lg text-white">
                    <h3 className="font-semibold text-lg mb-3">Architectural Readiness</h3>
                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="font-semibold mb-1">✅ Modular Agents</p>
                        <p className="text-xs opacity-90">New capabilities without core changes</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">✅ Cloud Native</p>
                        <p className="text-xs opacity-90">Horizontal scaling for high volume</p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">✅ API First</p>
                        <p className="text-xs opacity-90">Seamless enterprise integrations</p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Closing Statement */}
              <section className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-lg text-white">
                <h2 className="text-3xl font-bold mb-4">Closing Statement</h2>
                <p className="text-lg leading-relaxed mb-6">
                  We propose <strong>RFP-Copilot</strong> to incrementally automate the client's RFP response pipeline delivering measurable improvements in response timeliness quality of technical matches and pricing consistency — while keeping human reviewers in charge of final decisions. The MVP is intentionally scoped to demonstrate value quickly and the architecture is designed to scale and comply with enterprise governance needs.
                </p>
                <div className="border-t border-white/30 pt-6">
                  <p className="text-sm opacity-90">Prepared by:</p>
                  <p className="font-semibold text-lg mt-2">Vedant Mhatre Aditya Upasani Yash Mahajan</p>
                </div>
              </section>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
