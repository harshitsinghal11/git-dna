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
    <main className="min-h-[100dvh] bg-brand-bg flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-x-hidden">
      <InteractiveBackground />
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none z-0" />



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
                  className="w-full px-6 py-4 bg-brand-surface border border-brand-border rounded-lg text-brand-text-main placeholder:text-brand-text-muted/50 focus:outline-none focus:ring-2 focus:ring-brand-primary transition-all"
                  required
                />
              </div>

              {status === 'error' && (
                <div className="flex items-start gap-3 px-4 py-3 bg-brand-surface/30 border-l-2 border-[#ff3333]/80 rounded-r-lg text-[#ff3333] text-sm animate-fade-in text-left">
                  <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-bold uppercase tracking-wider text-[10px] opacity-80 mb-0.5">Scan Failed</p>
                    <p>{errorMsg}</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-4 px-6 bg-brand-primary hover:bg-brand-primary/90 text-[#0B0E14] font-bold rounded-lg transition-all hover:shadow-[0_0_20px_rgba(56,189,248,0.3)] active:scale-[0.98]"
              >
                Reveal My Developer Identity
              </button>
            </form>
          </div>
        ) : status === 'scanning' ? (
          <ScanningScreen />
        ) : (
          <div className="w-full flex flex-col items-center animate-fade-in">
            <IdentityCard data={data} onReset={() => {
              setStatus('idle');
              setUsername('');
              setData(null);
            }} />
          </div>
        )}
      </div>
    </main>
  );
}
