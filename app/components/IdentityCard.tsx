'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import OpenCardView from './OpenCardView';

type RevealState = 'closed' | 'analyzing' | 'level' | 'medals' | 'class' | 'done' | 'open';

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export default function IdentityCard({ data }: { data: any }) {
  const [revealState, setRevealState] = useState<RevealState>('closed');
  const [fullData, setFullData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  const { profile } = data;

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-0.5, 0.5], [15, -15]);
  const rotateY = useTransform(x, [-0.5, 0.5], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const xPos = (e.clientX - rect.left) / rect.width - 0.5;
    const yPos = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPos);
    y.set(yPos);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const startAnalysis = async () => {
    setRevealState('analyzing');
    setErrorMsg('');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: data._username }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Analysis failed');

      setFullData(result);
      setTimeout(() => setRevealState('level'), 500);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setRevealState('closed'); 
    }
  };

  useEffect(() => {
    if (revealState === 'closed' || revealState === 'open' || revealState === 'done' || revealState === 'analyzing') return;

    const timer = setTimeout(() => {
      if (revealState === 'level') setRevealState('medals');
      else if (revealState === 'medals') setRevealState('class');
      else if (revealState === 'class') setRevealState('done');
    }, 1500);

    return () => clearTimeout(timer);
  }, [revealState]);

  if (!data) return null;

  if (revealState === 'open' && fullData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-2xl h-[700px] perspective-[1000px]"
      >
        <OpenCardView data={fullData} />
      </motion.div>
    );
  }

  const identity = fullData?.identity || {};
  const levelSlug = identity.level ? slugify(identity.level) : '';

  return (
    <motion.div 
      className="w-full max-w-md mx-auto relative group perspective-[1000px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* The Physical Card */}
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative w-full rounded-2xl overflow-hidden bg-brand-surface border-[2px] border-brand-border/50 shadow-[0_20px_50px_rgba(11,14,20,0.8)] backdrop-blur-xl flex flex-col items-center text-center p-8 min-h-[500px] hover:border-brand-primary/50 transition-colors duration-500"
      >
        
        {/* Glow behind the card */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none" />

        {/* Avatar & Name - Always visible */}
        <div className="space-y-4 z-10 w-full mb-6" style={{ transform: "translateZ(30px)" }}>
          <div className="relative mx-auto w-28 h-28">
            <img 
              src={profile.avatarUrl} 
              alt="Avatar" 
              className="w-28 h-28 rounded-full border-4 border-brand-bg shadow-[0_0_20px_rgba(56,189,248,0.3)] relative z-10 object-cover"
            />
          </div>
          <div>
            <h2 className="text-3xl font-black text-brand-text-main tracking-tight">{profile.name || profile.login}</h2>
            <p className="text-brand-primary font-mono uppercase tracking-widest text-sm">@{profile.login}</p>
          </div>
        </div>

        {errorMsg && <p className="text-brand-error text-sm mb-4">{errorMsg}</p>}

        <AnimatePresence mode="popLayout">
          {/* Level Reveal */}
          {(revealState === 'level' || revealState === 'medals' || revealState === 'class' || revealState === 'done') && (
            <motion.div 
              key="level"
              initial={{ opacity: 0, scale: 0.5, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              transition={{ duration: 0.5, type: 'spring' }}
              className="w-full pb-6"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="relative flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-brand-bg border border-brand-primary/30 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(56,189,248,0.2)] overflow-hidden">
                  <img src={`/assets/levels/${levelSlug}.png`} alt={identity.level} className="w-full h-full object-contain opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                  <span className="absolute text-brand-primary text-xs opacity-30 font-mono">IMG</span>
                </div>
                <p className="text-xl font-bold text-brand-primary tracking-widest mt-3">{identity.level}</p>
              </div>
            </motion.div>
          )}

          {/* Medals Reveal */}
          {(revealState === 'medals' || revealState === 'class' || revealState === 'done') && (
            <motion.div 
              key="medals"
              initial={{ opacity: 0, scale: 0.5, height: 0 }}
              animate={{ opacity: 1, scale: 1, height: 'auto' }}
              transition={{ duration: 0.6, type: 'spring', delayChildren: 0.2, staggerChildren: 0.1 }}
              className="w-full pb-6"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="flex flex-wrap justify-center gap-4">
                {identity.medals?.map((medal: string) => (
                  <motion.div 
                    key={medal} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center space-y-1"
                  >
                    <div className="w-12 h-12 bg-brand-bg border border-brand-accent/30 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.15)] overflow-hidden relative">
                      <img src={`/assets/medals/${slugify(medal)}.png`} alt={medal} className="w-full h-full object-contain opacity-50" onError={(e) => e.currentTarget.style.display = 'none'} />
                      <span className="absolute text-brand-accent text-[10px] opacity-30 font-mono">IMG</span>
                    </div>
                    <span className="text-[10px] text-brand-text-muted font-bold uppercase tracking-wider">{medal}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Class Reveal */}
          {(revealState === 'class' || revealState === 'done') && (
            <motion.div 
              key="class"
              initial={{ opacity: 0, y: 20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="w-full pt-6 border-t border-brand-border/50"
              style={{ transform: "translateZ(60px)" }}
            >
              <motion.h3 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-2xl font-black text-brand-secondary uppercase tracking-widest mb-3" 
                style={{ textShadow: '0 0 10px rgba(129,140,248,0.3)' }}
              >
                {identity.developerClass}
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-sm text-brand-text-main/80 italic font-medium"
              >
                "{identity.description}"
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Button */}
        <div className="pt-8 w-full mt-auto" style={{ transform: "translateZ(20px)" }}>
          {revealState === 'closed' ? (
            <button 
              onClick={startAnalysis}
              className="w-full py-4 bg-brand-bg/50 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary/10 hover:border-brand-primary/60 rounded-xl font-bold tracking-widest transition-all uppercase text-sm shadow-[0_0_20px_rgba(56,189,248,0.1)]"
            >
              Reveal My Identity
            </button>
          ) : revealState === 'analyzing' ? (
            <div className="w-full py-4 text-brand-primary text-sm tracking-widest animate-pulse font-bold border border-transparent">
              ANALYZING GITHUB DATA...
            </div>
          ) : revealState === 'done' ? (
            <button 
              onClick={() => setRevealState('open')}
              className="w-full py-4 bg-brand-primary text-[#0B0E14] rounded-xl font-black tracking-widest uppercase text-sm shadow-[0_0_25px_rgba(56,189,248,0.5)] transition-all animate-pulse hover:scale-105"
            >
              Open Card
            </button>
          ) : (
            <div className="w-full py-4 text-brand-text-muted text-sm tracking-widest animate-pulse border border-transparent">
              REVEALING...
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

