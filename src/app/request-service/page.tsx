'use client';
import { useState } from 'react';

export default function RequestService() {
  const [formData, setFormData] = useState({
    name: '',
    phoneNumber: '',
    city: '',
    serviceId: '1',
    description: ''
  });
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'loading' | null, message: string }>({ type: null, message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Submitting your request...' });
    
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (!res.ok) {
        setStatus({ type: 'error', message: data.error || 'Failed to submit' });
      } else {
        setStatus({ type: 'success', message: 'Service requested successfully! We have notified our top providers.' });
        setFormData({ name: '', phoneNumber: '', city: '', serviceId: '1', description: '' });
      }
    } catch {
      setStatus({ type: 'error', message: 'Network error occurred.' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl p-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500 mb-6">
          Request a Service
        </h1>
        
        {status.type && (
          <div className={`p-4 rounded-lg mb-6 text-sm font-medium border ${status.type === 'error' ? 'bg-red-500/10 border-red-500/20 text-red-400' : status.type === 'success' ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-400'}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
            <input required type="text" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="John Doe" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">Phone Number</label>
              <input required type="tel" value={formData.phoneNumber} onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="9999999999" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">City</label>
              <input required type="text" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" placeholder="New York" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Service Type</label>
            <select value={formData.serviceId} onChange={e => setFormData({ ...formData, serviceId: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
              <option value="1">Service 1</option>
              <option value="2">Service 2</option>
              <option value="3">Service 3</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-slate-950/50 border border-slate-800 rounded-lg px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none" placeholder="Tell us more about what you need..."></textarea>
          </div>
          
          <button disabled={status.type === 'loading'} type="submit" className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-indigo-500/25 transition-all disabled:opacity-50">
            {status.type === 'loading' ? 'Processing...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </div>
  );
}
