'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { FileText, TrendingUp, Database, Edit } from 'lucide-react';
import { calculateMetrics, type RFP } from '@/lib/rfpParser';

export default function DashboardPage() {
  const router = useRouter();
  const [rfps, setRfps] = useState<RFP[]>([]);
  const [userName, setUserName] = useState('User');
  const [metrics, setMetrics] = useState<{
    rfpsAwaitingReview: number;
    avgMatchAccuracy: number;
    catalogCoverage: number;
    manualOverrides: number;
    sources: { website: number; email: number; uploaded: number };
    winRates: { month: string; rate: number }[];
    totalItems: number;
  }>({
    rfpsAwaitingReview: 0,
    avgMatchAccuracy: 0,
    catalogCoverage: 0,
    manualOverrides: 0,
    sources: { website: 0, email: 0, uploaded: 0 },
    winRates: [],
    totalItems: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user data from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setUserName(user.name || 'User');
      } catch (error) {
        console.error('Failed to parse user data:', error);
      }
    }

    // Load RFP data
    async function loadData() {
      try {
        const response = await fetch('/api/rfps');
        const data = await response.json();
        setRfps(data);
        setMetrics(calculateMetrics(data));
      } catch (error) {
        console.error('Failed to load RFPs:', error);
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
            <div className="text-gray-600">Loading RFP data...</div>
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
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Hello, {userName}
            </h1>
            <p className="text-gray-600">{metrics.rfpsAwaitingReview} RFPs are awaiting review</p>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            {/* RFPs Awaiting Review */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="text-gray-600 text-sm font-medium">
                  RFPs Awaiting Review
                </div>
                <FileText className="text-blue-500" size={20} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{metrics.rfpsAwaitingReview}</div>
              <div className="text-xs text-gray-500 mt-2">{metrics.totalItems} total items</div>
            </div>

            {/* Average Match Accuracy */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="text-gray-600 text-sm font-medium">
                  Average Match Accuracy
                </div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{metrics.avgMatchAccuracy}%</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp size={14} className="mr-1" />
                <span>3% vs last month</span>
              </div>
            </div>

            {/* Catalog Coverage */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="text-gray-600 text-sm font-medium">
                  Catalog Coverage
                </div>
                <Database className="text-blue-400" size={20} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{metrics.catalogCoverage}%</div>
              <div className="flex items-center text-sm text-green-600">
                <TrendingUp size={14} className="mr-1" />
                <span>2% vs last month</span>
              </div>
            </div>

            {/* Manual Overrides */}
            <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
              <div className="flex items-start justify-between mb-4">
                <div className="text-gray-600 text-sm font-medium">
                  Manual Overrides
                </div>
                <Edit className="text-orange-400" size={20} />
              </div>
              <div className="text-4xl font-bold text-gray-900 mb-2">{metrics.manualOverrides}</div>
              <div className="flex items-center text-sm text-red-600">
                <TrendingUp size={14} className="mr-1 rotate-180" />
                <span>Special requirements</span>
              </div>
            </div>
          </div>

          {/* Specification Matching Queue */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                Specification Matching Queue
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RFP Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Match Confidence
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {rfps.map((rfp) => {
                    const matchConfidence = 88 + Math.floor(Math.random() * 10);
                    const isUploadedPdf = rfp.origin_url?.includes('uploaded-pdf');
                    const handleReview = () => {
                      if (isUploadedPdf) {
                        window.open(`/api/rfps/${encodeURIComponent(rfp.id)}/pdf`, '_blank');
                      } else {
                        window.open('/rfp_sources.html', '_blank');
                      }
                    };
                    return (
                      <tr key={rfp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {rfp.title}
                          </div>
                          <div className="text-sm text-gray-500">{rfp.id}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rfp.due_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {rfp.scope.length} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${matchConfidence}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{matchConfidence}%</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={handleReview}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
