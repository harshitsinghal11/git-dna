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
      // Step 1: Only fetch the basic profile to prevent network tab spoilers
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to fetch developer data');
      }

      // Add the username explicitly so IdentityCard can use it for the analysis step
      setData({ ...result, _username: username.trim() });
      
      setTimeout(() => {
        setStatus('revealed');
      }, 2000);
      
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setStatus('error');
    }
  };

  return (
    <main className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 sm:p-24 relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />
      
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
          <div className="w-full flex flex-col items-center space-y-8 animate-fade-in">
            <IdentityCard data={data} />
            <button
              onClick={() => {
                setStatus('idle');
                setUsername('');
                setData(null);
              }}
              className="text-brand-text-muted hover:text-brand-text-main underline decoration-brand-border underline-offset-4 transition-colors"
            >
              Scan Another Developer
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
