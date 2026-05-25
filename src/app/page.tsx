import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-6">
          Prowider Mini
        </h1>
        <p className="text-lg text-slate-400 mb-12">
          An advanced, concurrency-safe lead distribution system with real-time dashboard updates and strict fair-allocation algorithms.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/request-service" className="group bg-slate-900 border border-slate-800 hover:border-blue-500 rounded-xl p-6 transition-all hover:-translate-y-1 shadow-lg hover:shadow-blue-500/20">
            <div className="text-blue-400 text-3xl mb-4">📝</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Customer Form</h2>
            <p className="text-sm text-slate-400">Public form to submit service enquiries.</p>
          </Link>
          
          <Link href="/dashboard" className="group bg-slate-900 border border-slate-800 hover:border-emerald-500 rounded-xl p-6 transition-all hover:-translate-y-1 shadow-lg hover:shadow-emerald-500/20">
            <div className="text-emerald-400 text-3xl mb-4">📊</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Dashboard</h2>
            <p className="text-sm text-slate-400">Real-time provider allocation monitoring.</p>
          </Link>
          
          <Link href="/test-tools" className="group bg-slate-900 border border-slate-800 hover:border-rose-500 rounded-xl p-6 transition-all hover:-translate-y-1 shadow-lg hover:shadow-rose-500/20">
            <div className="text-rose-400 text-3xl mb-4">🧪</div>
            <h2 className="text-xl font-bold text-slate-100 mb-2">Test Tools</h2>
            <p className="text-sm text-slate-400">Concurrency & webhook idempotency panel.</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
