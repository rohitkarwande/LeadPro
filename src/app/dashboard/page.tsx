'use client';
import { useState, useEffect } from 'react';

type Provider = {
  id: number;
  name: string;
  quota: number;
  usage: number;
  remaining: number;
  leads: { id: number; name: string; serviceId: number; assignedAt: string }[];
};

export default function Dashboard() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchDashboard = async () => {
    try {
      const res = await fetch('/api/dashboard');
      if (res.ok) {
        const data = await res.json();
        setProviders(data);
        setLastUpdated(new Date());
      }
    } catch (err) {
      console.error('Failed to fetch dashboard', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDashboard(); // initial fetch
    const interval = setInterval(fetchDashboard, 3000); // poll every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500 mb-2">
              Provider Dashboard
            </h1>
            <p className="text-slate-400">Live real-time monitoring of lead distributions.</p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-slate-500">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span>Live updates (Last sync: {lastUpdated.toLocaleTimeString()})</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {providers.map(provider => (
            <div key={provider.id} className="bg-slate-900/60 backdrop-blur-sm border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all flex flex-col h-[350px]">
              <div className="p-4 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                <h3 className="font-semibold text-lg text-slate-200">{provider.name}</h3>
                <div className={`px-2 py-1 rounded text-xs font-bold ${provider.remaining > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  {provider.remaining} slots left
                </div>
              </div>
              
              <div className="p-4 flex-grow flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-slate-950 rounded p-3 text-center border border-slate-800/50">
                    <div className="text-2xl font-black text-slate-100">{provider.usage}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Leads</div>
                  </div>
                  <div className="bg-slate-950 rounded p-3 text-center border border-slate-800/50">
                    <div className="text-2xl font-black text-slate-100">{provider.quota}</div>
                    <div className="text-xs text-slate-500 uppercase tracking-wider mt-1">Quota</div>
                  </div>
                </div>
                
                <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Assignments</h4>
                <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar space-y-2">
                  {provider.leads.length === 0 ? (
                    <div className="text-sm text-slate-600 text-center py-4 italic">No leads assigned yet</div>
                  ) : (
                    provider.leads.map(lead => (
                      <div key={lead.id} className="bg-slate-950/80 p-2.5 rounded border border-slate-800/50 group hover:bg-slate-800 transition-colors">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-slate-300 truncate">{lead.name}</span>
                          <span className="text-xs bg-blue-500/10 text-blue-400 px-1.5 py-0.5 rounded">Svc {lead.serviceId}</span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {new Date(lead.assignedAt).toLocaleTimeString()} - Lead #{lead.id}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Progress bar */}
              <div className="h-1.5 w-full bg-slate-800">
                <div 
                  className={`h-full transition-all duration-1000 ${provider.usage >= provider.quota ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${(provider.usage / provider.quota) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
      `}} />
    </div>
  );
}
