'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { allAgents } from '@/lib/agents';
import Link from 'next/link';
import { Bot, CheckCircle, Settings as SettingsIcon, Zap, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [agentStatus, setAgentStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<{ name: string; email: string; accountType: 'individual' | 'business' } | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');

  useEffect(() => {
    fetch('/api/process-rfp')
      .then(res => res.json())
      .then(data => {
        setAgentStatus(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching agent status:', err);
        setLoading(false);
      });

    // Load current user profile if logged in
    async function loadProfile() {
      try {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        if (!token && user) {
          const u = JSON.parse(user);
          setProfile({ name: u.name, email: u.email, accountType: u.accountType });
          return;
        }
        if (token) {
          const res = await fetch('/api/user', { headers: { Authorization: `Bearer ${token}` } });
          const data = await res.json();
          if (data.success && data.user) {
            setProfile({ name: data.user.name, email: data.user.email, accountType: data.user.accountType });
            localStorage.setItem('user', JSON.stringify(data.user));
          }
        }
      } catch (e) {
        // ignore
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!profile) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await fetch('/api/user', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify(profile),
        });
        const data = await res.json();
        if (data.success) {
          localStorage.setItem('user', JSON.stringify(data.user));
          setSaveMsg('Saved successfully');
        } else {
          setSaveMsg(data.error || 'Save failed');
        }
      } else {
        localStorage.setItem('user', JSON.stringify({ ...profile }));
        setSaveMsg('Saved locally');
      }
    } catch (e) {
      setSaveMsg('Save failed');
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMsg(''), 2500);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-48 flex-1">
        <Header />
        <main className="mt-16 p-8 bg-gray-50 min-h-screen">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Agents Configuration</h1>
            <p className="text-gray-600">Manage and configure your AI-powered RFP processing agents</p>
            
              {!loading && agentStatus && (
                <div className={`mt-4 p-4 rounded-lg border ${agentStatus.configured ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'}`}>
                  <div className="flex items-center gap-2">
                    {agentStatus.configured ? (
                      <>
                        <CheckCircle className="text-green-600" size={20} />
                        <span className="text-green-800 font-medium">LangChain Agents: Active</span>
                        <span className="text-green-600 text-sm ml-2">• Model: {agentStatus.model}</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="text-yellow-600" size={20} />
                        <span className="text-yellow-800 font-medium">Configure API Key in .env.local</span>
                      </>
                    )}
                  </div>
                  {!agentStatus.configured && (
                    <p className="text-sm text-yellow-700 mt-2">
                      Set <code className="bg-yellow-100 px-1 rounded">GEMINI_API_KEY</code> in your <code className="bg-yellow-100 px-1 rounded">.env.local</code> file to enable AI agents. Get your key from <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="underline">Google AI Studio</a>
                    </p>
                  )}
                </div>
              )}
          </div>

          {/* Agents Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {allAgents.map((agent, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className={`p-6 ${
                  index === 0 ? 'bg-gradient-to-br from-indigo-700 to-purple-800' :
                  index === 1 ? 'bg-gradient-to-br from-blue-700 to-blue-900' :
                  index === 2 ? 'bg-gradient-to-br from-emerald-700 to-teal-800' :
                  'bg-gradient-to-br from-amber-600 to-orange-700'
                } text-white`}>
                  <div className="flex items-start justify-between mb-3">
                    <Bot size={32} />
                    <div className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <CheckCircle size={14} />
                      Active
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-1">{agent.name}</h3>
                  <p className="text-sm opacity-90">{agent.role}</p>
                </div>

                {/* Body */}
                <div className="p-6">
                  <p className="text-gray-700 mb-4">{agent.description}</p>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Key Capabilities:</p>
                    {agent.capabilities.map((capability, capIdx) => (
                      <div key={capIdx} className="flex items-start gap-2">
                        <CheckCircle size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{capability}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                  <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
                      <Zap size={16} />
                      LangChain Powered
                  </button>
                  <Link
                    href={`/logs?agent=${encodeURIComponent(
                      index === 0 ? 'Sales' : index === 1 ? 'Tech' : index === 2 ? 'Pricing' : 'Main'
                    )}`}
                    className="flex-1 text-center border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    View Logs
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Profile Settings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <SettingsIcon size={20} className="text-gray-600" />
              <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Name</label>
                <input
                  value={profile?.name || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, name: e.target.value } : prev)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={profile?.email || ''}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, email: e.target.value } : prev)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Account Type</label>
                <select
                  value={profile?.accountType || 'individual'}
                  onChange={(e) => setProfile(prev => prev ? { ...prev, accountType: e.target.value as any } : prev)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-900"
                >
                  <option value="individual">Individual</option>
                  <option value="business">Business</option>
                </select>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {saveMsg && <span className="text-sm text-gray-600">{saveMsg}</span>}
            </div>
          </div>

          {/* Agent Workflow Diagram */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Agent Workflow</h2>
            <p className="text-gray-600 mb-6">
              The agents work together in a coordinated workflow to process RFPs end-to-end:
            </p>

            <div className="flex items-center justify-between">
              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Bot className="text-indigo-600" size={32} />
                </div>
                <p className="font-semibold text-sm text-gray-600">Sales Agent</p>
                <p className="text-xs text-gray-400">Discovers RFPs</p>
              </div>
              
              <div className="flex-shrink-0 px-4">
                <div className="w-8 h-0.5 bg-gray-300"></div>
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Bot className="text-blue-600" size={32} />
                </div>
                <p className="font-semibold text-sm text-gray-600">Tech Agent</p>
                <p className="text-xs text-gray-400">Matches Specs</p>
              </div>
              
              <div className="flex-shrink-0 px-4">
                <div className="w-8 h-0.5 bg-gray-300"></div>
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Bot className="text-emerald-600" size={32} />
                </div>
                <p className="font-semibold text-sm text-gray-600">Pricing Agent</p>
                <p className="text-xs text-gray-400">Calculates Costs</p>
              </div>
              
              <div className="flex-shrink-0 px-4">
                <div className="w-8 h-0.5 bg-gray-300"></div>
              </div>

              <div className="text-center flex-1">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
                  <Bot className="text-amber-600" size={32} />
                </div>
                <p className="font-semibold text-sm text-gray-600">Main Agent</p>
                <p className="text-xs text-gray-400">Orchestrates</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
