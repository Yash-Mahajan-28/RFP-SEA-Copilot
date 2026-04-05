'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Filter } from 'lucide-react';

type AgentName = 'Sales' | 'Tech' | 'Pricing' | 'Main' | 'Collective';

export default function ReportsPage() {
  const [agent, setAgent] = useState<AgentName>('Collective');
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const agentOptions: AgentName[] = useMemo(
    () => ['Collective', 'Main', 'Sales', 'Tech', 'Pricing'],
    []
  );

  async function loadReports(selected: AgentName) {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selected) query.set('agent', selected);
      const res = await fetch(`/api/agent-reports?${query.toString()}`);
      const data = await res.json();
      setReports(data.reports || []);
    } catch (e) {
      setReports([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReports(agent);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agent]);

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1">
        <Header />
        <main className="mt-16 p-8 bg-gray-50 min-h-screen text-black">
          <div className="mb-6 flex items-center justify-between text-black">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Agent Reports</h1>
              <p className="text-black">Summaries for each agent and overall</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 flex items-center gap-3 text-black">
            <Filter size={16} className="text-black" />
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-black"
              value={agent}
              onChange={(e) => setAgent(e.target.value as AgentName)}
            >
              {agentOptions.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-black">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-black">No reports found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 text-black">
              {reports.map((r, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center justify-between mb-2 text-black">
                    <span className="text-xs text-black">{new Date(r.createdAt).toLocaleString()}</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-black">{r.agent}</span>
                  </div>
                  <div className="text-sm text-black mb-1">{r.rfpId || '-'}</div>
                  <div className="text-lg font-semibold text-black mb-2">{r.summary}</div>
                  {r.metrics ? (
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {Object.entries(r.metrics).map(([k, v]: any) => (
                        <div key={k} className="bg-gray-50 rounded p-3">
                          <div className="text-xs text-black">{k}</div>
                          <div className="text-black font-semibold">{typeof v === 'number' ? v.toLocaleString() : v}</div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {r.data ? (
                    <details className="mt-3">
                      <summary className="cursor-pointer text-xs text-black">Full data</summary>
                      <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto text-black">{JSON.stringify(r.data, null, 2)}</pre>
                    </details>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
