'use client';

import { useState } from 'react';
import ScanningScreen from './components/ScanningScreen';
import IdentityCard from './components/IdentityCard';
import InteractiveBackground from './components/InteractiveBackground';
import { GitDNAData } from './lib/engine';

export default function Home() {
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'revealed' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [data, setData] = useState<GitDNAData | null>(null);

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

    } catch (err: unknown) {
      console.error(err);
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('An unknown error occurred.');
      }
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center pt-24 pb-6 px-4 sm:p-24 relative overflow-x-hidden">
      <InteractiveBackground />
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none z-0" />

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
                Git <span className="text-brand-primary">DNA</span>
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
                <div className="flex items-center gap-3 p-4 bg-[#ff3333]/10 border border-[#ff3333]/30 rounded-xl text-[#ff3333] text-sm font-medium shadow-[0_0_15px_rgba(255,51,51,0.15)] animate-fade-in text-left">
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-[#ff3333]/20">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[10px] opacity-80 mb-0.5">Scan Failed</p>
                    <p>{errorMsg}</p>
                  </div>
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
