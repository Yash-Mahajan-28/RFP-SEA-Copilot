'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { type RFP } from '@/lib/rfpParser';
import { Bot, Loader2, Send } from 'lucide-react';

interface ChatTrace {
  perception: {
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
  };
  decision: {
    intent: string;
    rationale: string;
    confidence: number;
  };
  action: {
    answer: string;
    nextActions: string[];
  };
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  trace?: ChatTrace;
}

export default function TestAgentsPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [selectedRfpId, setSelectedRfpId] = useState('');
  const [requirement, setRequirement] = useState('Need 11kV cable support with strong compliance coverage and realistic commercial viability.');
  const [question, setQuestion] = useState('Can we bid this RFP for my requirement and what should we do next?');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingRfps, setLoadingRfps] = useState(true);

  const selectedRfp = useMemo(() => rfps.find((r) => r.id === selectedRfpId), [rfps, selectedRfpId]);

  useEffect(() => {
    async function loadRfps() {
      try {
        const response = await fetch('/api/rfps');
        const data = await response.json();
        const list = Array.isArray(data) ? data : [];
        setRfps(list);
        if (list.length > 0) {
          setSelectedRfpId(list[0].id);
        }
      } catch (error) {
        console.error('Failed to load RFPs:', error);
      } finally {
        setLoadingRfps(false);
      }
    }

    loadRfps();
  }, []);

  async function sendMessage() {
    const trimmedQuestion = question.trim();
    const trimmedRequirement = requirement.trim();
    if (!selectedRfpId || !trimmedQuestion || !trimmedRequirement) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmedQuestion,
    };

    setMessages((prev) => [...prev, userMessage]);
    setSending(true);

    try {
      const response = await fetch('/api/rfp-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfpId: selectedRfpId,
          userRequirement: trimmedRequirement,
          question: trimmedQuestion,
        }),
      });

      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to get chatbot response');
      }

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        content: data.answer,
        trace: data.trace,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: `e-${Date.now()}`,
          role: 'assistant',
          content: error instanceof Error ? error.message : 'Unable to process request.',
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1">
        <Header />
        <main className="mt-16 p-8 bg-gray-50 min-h-screen">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">RFP Agent Chat</h1>
            <p className="text-gray-600 mt-1">
              LangGraph workflow demo: Perception {'->'} Decision {'->'} Action for a selected RFP and user requirement.
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-4">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">Select RFP</label>
                <select
                  value={selectedRfpId}
                  onChange={(e) => setSelectedRfpId(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                  disabled={loadingRfps || sending}
                >
                  {rfps.map((rfp) => (
                    <option key={rfp.id} value={rfp.id}>
                      {rfp.id} - {rfp.title}
                    </option>
                  ))}
                </select>

                {selectedRfp ? (
                  <div className="mt-3 text-xs text-gray-600 bg-gray-50 rounded-lg p-3">
                    <div><span className="font-semibold">Due:</span> {selectedRfp.due_date}</div>
                    <div><span className="font-semibold">Entity:</span> {selectedRfp.issuing_entity || 'Unknown'}</div>
                    <div><span className="font-semibold">Items:</span> {selectedRfp.scope.length}</div>
                  </div>
                ) : null}
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">User Requirement</label>
                <textarea
                  value={requirement}
                  onChange={(e) => setRequirement(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                  disabled={sending}
                />
                <p className="text-xs text-gray-500 mt-2">
                  This conditions the chatbot to answer for your specific bid objective.
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <label className="block text-sm font-medium text-gray-800 mb-2">Question</label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900"
                  disabled={sending}
                />
                <button
                  onClick={sendMessage}
                  disabled={sending || !selectedRfpId || !requirement.trim() || !question.trim()}
                  className="mt-3 w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  {sending ? 'Thinking...' : 'Ask Agent'}
                </button>
              </div>
            </div>

            <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-4 min-h-[520px]">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="text-blue-600" size={20} />
                <h2 className="text-lg font-semibold text-gray-900">Conversation</h2>
              </div>

              {messages.length === 0 ? (
                <div className="h-[440px] flex items-center justify-center text-gray-500 text-sm">
                  Ask a question to start the RFP-specific chatbot.
                </div>
              ) : (
                <div className="space-y-4 max-h-[640px] overflow-y-auto pr-1">
                  {messages.map((message) => (
                    <div key={message.id} className={message.role === 'user' ? 'text-right' : 'text-left'}>
                      <div
                        className={`inline-block rounded-xl px-4 py-3 max-w-[90%] text-sm ${
                          message.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        {message.content}
                      </div>

                      {message.trace ? (
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
                          <div className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Perception</div>
                            <div className="text-xs text-gray-800">
                              {message.trace.perception.relevantItems.length} relevant items found
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              {message.trace.perception.relevantItems
                                .slice(0, 2)
                                .map((i) => `#${i.itemId} (${i.qty})`)
                                .join(', ')}
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Decision</div>
                            <div className="text-xs text-gray-800">
                              Intent: {message.trace.decision.intent}
                            </div>
                            <div className="text-xs text-gray-600 mt-1">
                              Confidence: {message.trace.decision.confidence}%
                            </div>
                          </div>

                          <div className="border border-gray-200 rounded-lg p-3 bg-white">
                            <div className="text-xs font-semibold text-gray-500 mb-1">Action</div>
                            <div className="text-xs text-gray-800">
                              Next: {message.trace.action.nextActions.slice(0, 2).join(' | ') || 'None'}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
