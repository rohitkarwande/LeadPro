'use client';
import { useState } from 'react';

export default function TestTools() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 50));

  const runWebhookTest = async (idempotencyKey: string) => {
    setLoading(true);
    addLog(`Calling Webhook with Idempotency Key: ${idempotencyKey}`);
    try {
      const res = await fetch('/api/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idempotencyKey })
      });
      const data = await res.json();
      addLog(`Webhook Response: ${JSON.stringify(data)}`);
    } catch (e: unknown) {
      addLog(`Webhook Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  const runConcurrencyTest = async () => {
    setLoading(true);
    addLog(`Starting Concurrency Test: 10 leads simultaneously`);
    try {
      const res = await fetch('/api/test/concurrency', { method: 'POST' });
      const data = await res.json();
      addLog(`Concurrency Result: ${data.successCount} succeeded, ${data.errorCount} failed. Status: ${data.status}`);
    } catch (e: unknown) {
      addLog(`Concurrency Error: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-rose-500 mb-8">
          Testing & Verification Panel
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Webhook Tools */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center">
              <span className="bg-orange-500/20 text-orange-400 p-2 rounded mr-3">🔗</span>
              Webhook Simulator
            </h2>
            <p className="text-sm text-slate-400 mb-6">Simulates a payment gateway webhook resetting provider quotas to 10.</p>
            
            <div className="space-y-4">
              <button 
                disabled={loading}
                onClick={() => runWebhookTest(`test-key-${Date.now()}`)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg border border-slate-700 transition-colors"
              >
                Reset Quotas (New Key)
              </button>
              
              <button 
                disabled={loading}
                onClick={() => {
                  const key = 'fixed-duplicate-key-123';
                  runWebhookTest(key);
                }}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white font-medium py-2.5 px-4 rounded-lg border border-slate-700 transition-colors"
              >
                Call Webhook (Duplicate Key)
              </button>
            </div>
          </div>

          {/* Concurrency Tools */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-slate-100 flex items-center">
              <span className="bg-rose-500/20 text-rose-400 p-2 rounded mr-3">⚡</span>
              Concurrency Tester
            </h2>
            <p className="text-sm text-slate-400 mb-6">Fires 10 simultaneous POST requests to create leads for Service 1.</p>
            
            <button 
              disabled={loading}
              onClick={runConcurrencyTest}
              className="w-full bg-gradient-to-r from-rose-500 to-orange-600 hover:from-rose-600 hover:to-orange-700 text-white font-medium py-3 px-4 rounded-lg shadow-lg transition-colors flex items-center justify-center"
            >
              {loading ? 'Running...' : 'Generate 10 Leads Instantly'}
            </button>
          </div>
        </div>
        
        {/* Logs */}
        <div className="bg-black/50 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-64">
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2 font-mono text-sm text-slate-400 flex justify-between">
            <span>Terminal Logs</span>
            <button onClick={() => setLogs([])} className="hover:text-white transition-colors">Clear</button>
          </div>
          <div className="p-4 font-mono text-sm text-green-400 overflow-y-auto custom-scrollbar space-y-1">
            {logs.length === 0 ? <span className="text-slate-600">Waiting for actions...</span> : logs.map((l, i) => <div key={i}>{l}</div>)}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}} />
    </div>
  );
}
