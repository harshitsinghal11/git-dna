'use client';

import { useState } from 'react';
import ScanningScreen from './components/ScanningScreen';
import IdentityCard from './components/IdentityCard';

export default function Home() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'revealed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<any>(null);

  const handleReveal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setStatus('scanning');
    setErrorMsg('');

    try {
      const minDelay = new Promise(resolve => setTimeout(resolve, 3000));
      const resPromise = fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const [res] = await Promise.all([resPromise, minDelay]);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch developer data');
      }

      setData(result);
      setStatus('revealed');
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center pt-24 pb-6 px-4 sm:p-24 relative overflow-x-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />

      {status === 'revealed' && (
        <button
          onClick={() => {
            setStatus('idle');
            setUsername('');
            setData(null);
          }}
          className="fixed top-4 left-4 md:top-12 md:left-12 flex items-center gap-2 px-4 py-2 bg-brand-surface border border-brand-border rounded-xl text-brand-text-muted hover:text-white hover:border-brand-primary/50 hover:bg-brand-primary/10 transition-all z-50 text-xs font-bold uppercase tracking-wider shadow-lg"
        >
          <span>←</span> New Scan
        </button>
      )}
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center">
        {status === 'idle' || status === 'error' ? (
          <div className="w-full max-w-md space-y-8 text-center animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-brand-text-main">
                Developer <span className="text-brand-primary">Identity</span>
              </h1>
              <p className="text-brand-text-muted">
                Enter a GitHub username to reveal their true developer class, stats, and journey.
              </p>
            </div>

            <form onSubmit={handleReveal} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="GitHub Username"
                  className="w-full px-6 py-4 bg-brand-surface border border-brand-border rounded-xl text-brand-text-main placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  required
                />
              </div>

              {status === 'error' && (
                <div className="p-4 bg-brand-error/10 border border-brand-error/30 rounded-lg text-brand-error text-sm">
                  {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 bg-brand-primary hover:bg-brand-primary/90 text-[#0B0E14] font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] active:scale-[0.98]"
              >
                Reveal My Developer Identity
              </button>
            </form>
          </div>
        ) : status === 'scanning' ? (
          <ScanningScreen />
        ) : (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <IdentityCard data={data} />
          </div>
        )}
      </div>
    </main>
  );
}
