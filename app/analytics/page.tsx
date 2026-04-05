'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { calculateMetrics } from '@/lib/rfpParser';

export default function AnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await fetch('/api/rfps');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        setMetrics(calculateMetrics(Array.isArray(data) ? data : []));
      } catch (e) {
        // Fall back to default metrics series for Win Rate Trends
        setMetrics(calculateMetrics([]));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="ml-48 flex-1">
          <Header />
          <main className="mt-16 p-8 bg-gray-50 min-h-screen flex items-center justify-center">
            <div className="text-gray-600">Loading analytics...</div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1">
        <Header />
        <main className="mt-16 p-8 bg-gray-50 min-h-screen">
          {/* Win Rate Trends */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              Win Rate Trends
            </h2>
            {(() => {
              const data = metrics.winRates || [];
              if (!data.length) return <div className="text-sm text-gray-500">No win rate data yet.</div>;

              const width = 1000; // logical width for viewBox, will scale to container
              const height = 260;
              const padding = 40;
              const maxRate = Math.max(...data.map((d: any) => d.rate), 100);
              const minRate = Math.min(...data.map((d: any) => d.rate), 0);
              const xStep = (width - padding * 2) / Math.max(1, data.length - 1);

              const points = data.map((d: any, i: number) => {
                const x = padding + i * xStep;
                const y = padding + (1 - (d.rate - minRate) / (maxRate - minRate || 1)) * (height - padding * 2);
                return { x, y, ...d };
              });

              const pathD = points
                .map((p: any, i: number) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                .join(' ');

              return (
                <div className="w-full">
                  <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-64">
                    {/* Grid lines */}
                    {[0.25, 0.5, 0.75, 1].map((t, idx) => {
                      const y = padding + t * (height - padding * 2);
                      return <line key={idx} x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e5e7eb" strokeWidth={1} />;
                    })}

                    {/* Area fill */}
                    <defs>
                      <linearGradient id="winrate-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
                      fill="url(#winrate-fill)"
                      stroke="none"
                    />

                    {/* Line */}
                    <path d={pathD} fill="none" stroke="#2563eb" strokeWidth={3} strokeLinecap="round" />

                    {/* Points */}
                    {points.map((p: any, i: number) => (
                      <g key={i}>
                        <circle cx={p.x} cy={p.y} r={6} fill="#2563eb" />
                        <circle cx={p.x} cy={p.y} r={10} fill="transparent" />
                        <title>{`${p.month}: ${p.rate}% win rate`}</title>
                      </g>
                    ))}

                    {/* X axis labels */}
                    {points.map((p: any, i: number) => (
                      <text key={i} x={p.x} y={height - padding + 18} fontSize={11} fill="#6b7280" textAnchor="middle">
                        {p.month}
                      </text>
                    ))}

                    {/* Y axis ticks */}
                    {[minRate, (minRate + maxRate) / 2, maxRate].map((v: number, idx: number) => (
                      <g key={idx}>
                        <text x={padding - 8} y={padding + (1 - (v - minRate) / (maxRate - minRate || 1)) * (height - padding * 2) + 4} fontSize={11} fill="#6b7280" textAnchor="end">
                          {Math.round(v)}%
                        </text>
                      </g>
                    ))}
                  </svg>
                </div>
              );
            })()}
          </div>

          {/* Removed Processing Volume static chart as requested */}

          <div className="grid grid-cols-2 gap-6">
            {/* RFP Source Effectiveness */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                RFP Source Effectiveness
              </h2>
              {(() => {
                const totalSources = Math.max(1, metrics.sources.website + metrics.sources.email + metrics.sources.uploaded);
                const pct = {
                  website: (metrics.sources.website / totalSources) * 100,
                  email: (metrics.sources.email / totalSources) * 100,
                  uploaded: (metrics.sources.uploaded / totalSources) * 100,
                };
                return (
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Website</span>
                        <span className="text-sm font-medium text-gray-900">
                          {metrics.sources.website} RFPs ({pct.website.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${pct.website}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-900">Email</span>
                        <span className="text-sm font-medium text-gray-900">
                          {metrics.sources.email} RFPs ({pct.email.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${pct.email}%` }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Uploaded PDF</span>
                        <span className="text-sm font-medium text-gray-900">
                          {metrics.sources.uploaded} RFPs ({pct.uploaded.toFixed(0)}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${pct.uploaded}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>

            {/* Agent Performance Metrics */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Agent Performance Metrics
              </h2>
              {(() => {
                const performance = [
                  { name: 'Sales Agent', metric: 'Qualification Rate', value: 94, color: 'bg-green-500' },
                  { name: 'Technical Agent', metric: 'Spec Match Accuracy', value: 90, color: 'bg-blue-500' },
                  { name: 'Pricing Agent', metric: 'Pricing Completeness', value: 88, color: 'bg-amber-500' },
                ];

                return (
                  <div className="space-y-4">
                    {performance.map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            <div className="text-xs text-gray-500">{item.metric}</div>
                          </div>
                          <div className={`${item.color} text-white text-xs font-bold px-3 py-1 rounded-full`}>
                            {item.value}%
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`${item.color} h-2 rounded-full transition-all`}
                            style={{ width: `${item.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
