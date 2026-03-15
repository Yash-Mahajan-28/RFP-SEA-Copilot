'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { type RFP } from '@/lib/rfpParser';
import { Search, Globe, Download, CheckCircle } from 'lucide-react';

export default function DiscoveryPage() {
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [uploadViewMode, setUploadViewMode] = useState<'json' | 'table'>('table');

  useEffect(() => {
    async function loadData() {
      const response = await fetch('/api/rfps');
      const data = await response.json();
      setRfps(data);
      setLoading(false);
    }
    loadData();
  }, []);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadResult(null);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('title', file.name);
      form.append('entity', 'Uploaded');
      form.append('type', 'PDF');

      const res = await fetch('/api/upload-rfp', { method: 'POST', body: form });
      const data = await res.json();
      if (data.parser) {
        console.log(`🤖 Parsed by ${data.parser === 'gemini' ? 'Gemini AI' : 'Heuristic Parser'}`);
      }
      setUploadResult(data);
    } catch (err) {
      setUploadResult({ success: false, error: 'Upload failed' });
    } finally {
      setUploading(false);
    }
  }

  const sources = [
    { name: 'PSU Energy Portal', url: 'https://psu.energy.gov.in', count: rfps.filter(r => r.origin_url.includes('psu')).length, status: 'active' },
    { name: 'Metro Rail Corporation', url: 'https://metro.gov.in', count: rfps.filter(r => r.origin_url.includes('metro')).length, status: 'active' },
    { name: 'FMCG Private Sector', url: 'https://fmcg.example.com', count: rfps.filter(r => r.origin_url.includes('fmcg')).length, status: 'active' },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1">
        <Header />
        <main className="mt-16 p-8 bg-gray-50 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">RFP Discovery</h1>
            <p className="text-gray-600">Automated monitoring and discovery of RFPs from configured sources</p>
          </div>

          {/* Upload RFP PDF */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-semibold text-gray-900">Upload RFP PDF</h2>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleUpload}
              className="block w-full text-sm text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {uploading && <div className="mt-3 text-sm text-gray-600">Uploading and parsing...</div>}
            {uploadResult && (
              <div className={`mt-3 p-3 rounded border ${uploadResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {uploadResult.success ? (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm text-black font-semibold">Parsed RFP</div>
                      <div className="flex items-center gap-2">
                        <div className="flex bg-gray-200 rounded-lg p-1">
                          <button
                            onClick={() => setUploadViewMode('table')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${uploadViewMode === 'table' ? 'bg-white text-black shadow' : 'text-gray-600 hover:text-black'}`}
                          >
                            Table
                          </button>
                          <button
                            onClick={() => setUploadViewMode('json')}
                            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${uploadViewMode === 'json' ? 'bg-white text-black shadow' : 'text-gray-600 hover:text-black'}`}
                          >
                            JSON
                          </button>
                        </div>
                      </div>
                    </div>
                    {uploadViewMode === 'json' ? (
                      <pre className="mt-2 bg-gray-50 p-2 rounded text-xs overflow-x-auto text-black">{JSON.stringify(uploadResult.rfp, null, 2)}</pre>
                    ) : (
                      <div className="mt-2 overflow-x-auto">
                        <table className="w-full text-xs border border-gray-200">
                          <tbody>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">ID</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.id}</td></tr>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">Title</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.title}</td></tr>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">Due Date</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.due_date}</td></tr>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">Issuing Entity</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.issuing_entity}</td></tr>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">Type</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.type}</td></tr>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">Items</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.scope.length}</td></tr>
                            <tr><td className="border px-2 py-1 font-semibold bg-gray-50 text-black">Tests</td><td className="border px-2 py-1 text-black">{uploadResult.rfp.tests.length > 0 ? uploadResult.rfp.tests.join(', ') : 'None'}</td></tr>
                          </tbody>
                        </table>
                        <div className="mt-3">
                          <div className="font-semibold text-black mb-1">Scope Items:</div>
                          <table className="w-full text-xs border border-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="border px-2 py-1 text-left text-black">ID</th>
                                <th className="border px-2 py-1 text-left text-black">Description</th>
                                <th className="border px-2 py-1 text-left text-black">Qty</th>
                                <th className="border px-2 py-1 text-left text-black">Conductor</th>
                                <th className="border px-2 py-1 text-left text-black">Voltage</th>
                                <th className="border px-2 py-1 text-left text-black">Insulation</th>
                              </tr>
                            </thead>
                            <tbody>
                              {uploadResult.rfp.scope.map((item: any) => (
                                <tr key={item.item_id}>
                                  <td className="border px-2 py-1 text-black">{item.item_id}</td>
                                  <td className="border px-2 py-1 text-black">{item.description}</td>
                                  <td className="border px-2 py-1 text-black">{item.qty}</td>
                                  <td className="border px-2 py-1 text-black">{item.specs.conductor_size_mm2}mm²</td>
                                  <td className="border px-2 py-1 text-black">{item.specs.voltage_kv}kV</td>
                                  <td className="border px-2 py-1 text-black">{item.specs.insulation_mm}mm</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-black">{uploadResult.error || 'Failed'}</div>
                )}
              </div>
            )}
          </div>

          {/* Sources */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Monitored Sources</h2>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
                <Search size={16} />
                Scan Now
              </button>
            </div>

            <div className="space-y-4">
              {sources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Globe className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{source.name}</p>
                      <p className="text-sm text-gray-500">{source.url}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-2xl font-bold text-gray-900">{source.count}</p>
                      <p className="text-sm text-gray-500">RFPs found</p>
                    </div>
                    <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle size={14} />
                      {source.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Discoveries */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Discoveries</h2>
              <span className="text-sm text-gray-500">{rfps.length} total RFPs</span>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-600">Loading discoveries...</div>
            ) : (
              <div className="space-y-3">
                {rfps.map((rfp) => (
                  <div key={rfp.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <Download className="text-blue-600" size={20} />
                      <div>
                        <p className="font-semibold text-gray-900">{rfp.title}</p>
                        <p className="text-sm text-gray-500">{rfp.id} • Due: {rfp.due_date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                        {rfp.type}
                      </span>
                      <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                        Import
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
