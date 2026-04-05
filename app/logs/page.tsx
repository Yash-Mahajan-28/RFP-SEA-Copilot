'use client';

import { useEffect, useMemo, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { Filter, RefreshCw } from 'lucide-react';

type AgentName = 'Sales' | 'Tech' | 'Pricing' | 'Main' | 'Collective';

export default function LogsPage() {
  const [agent, setAgent] = useState<AgentName>('Collective');
  const [rfpId, setRfpId] = useState('');
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLog, setExpandedLog] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'json'>('table');

  const agentOptions: AgentName[] = useMemo(
    () => ['Collective', 'Main', 'Sales', 'Tech', 'Pricing'],
    []
  );

  async function loadLogs(selected: AgentName, rfp?: string) {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (selected) query.set('agent', selected);
      if (rfp) query.set('rfpId', rfp);
      const res = await fetch(`/api/agent-logs?${query.toString()}`);
      const data = await res.json();
      setLogs(data.logs || []);
    } catch (e) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs(agent);
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
              <h1 className="text-3xl font-bold text-gray-900">Agent Logs</h1>
              <p className="text-black">Real-time logs by agent and RFP</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex bg-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('table')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'table' ? 'bg-white text-black shadow' : 'text-gray-600 hover:text-black'}`}
                >
                  Table
                </button>
                <button
                  onClick={() => setViewMode('json')}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${viewMode === 'json' ? 'bg-white text-black shadow' : 'text-gray-600 hover:text-black'}`}
                >
                  JSON
                </button>
              </div>
              <button
                onClick={() => loadLogs(agent, rfpId || undefined)}
                className="inline-flex items-center gap-2 border border-gray-300 text-black px-4 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                <RefreshCw size={16} /> Refresh
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="flex items-center gap-3">
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
            <div className="flex items-center gap-3">
              <span className="text-sm text-black">RFP ID</span>
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full text-black"
                placeholder="e.g. RFP-PSU-RE-2025-001"
                value={rfpId}
                onChange={(e) => setRfpId(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => loadLogs(agent, rfpId || undefined)}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
              >
                Apply Filters
              </button>
            </div>
          </div>

          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-black">Loading logs...</div>
          ) : logs.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 text-black">No logs found.</div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {viewMode === 'json' ? (
                <div className="p-4">
                  <pre className="text-xs overflow-x-auto text-black">{JSON.stringify(logs, null, 2)}</pre>
                </div>
              ) : (
                <table className="w-full text-black">
                  <thead className="bg-gray-50 border-b border-gray-200 text-black">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Agent</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">RFP</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Message</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Duration</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Data</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-black">
                    {logs.map((log, idx) => (
                      <tr key={idx} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-black">{log.agent}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          <div className="text-black">{log.rfpId || '-'}</div>
                          <div className="text-black text-xs">{log.rfpTitle || ''}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            log.level === 'error' ? 'bg-red-100 text-black' : log.level === 'warn' ? 'bg-yellow-100 text-black' : 'bg-green-100 text-black'
                          }`}>
                            {log.level?.toUpperCase?.() || 'INFO'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-black">{log.message}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">{log.durationMs ? `${log.durationMs} ms` : '-'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                          {log.data ? (
                            <details>
                              <summary className="cursor-pointer text-black text-xs">View</summary>
                              <pre className="mt-2 bg-gray-50 p-2 rounded text-xs max-h-64 overflow-auto text-black">{JSON.stringify(log.data, null, 2)}</pre>
                            </details>
                          ) : (
                            <span className="text-black">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
