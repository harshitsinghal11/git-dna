'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import OpenCardView from './OpenCardView';

type RevealState = 'closed' | 'analyzing' | 'level' | 'medals' | 'done' | 'open';

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const getLevelColor = (levelNumber: number) => {
  switch (levelNumber) {
    case 7: return 'rgba(185, 242, 255, 0.8)'; // Mythic
    case 6: return 'rgba(239, 68, 68, 0.8)'; // Vanguard
    case 5: return 'rgba(249, 115, 22, 0.8)'; // Architect
    case 4: return 'rgba(168, 85, 247, 0.8)'; // Craftsman
    case 3: return 'rgba(56, 189, 248, 0.8)'; // Builder
    case 2: return 'rgba(34, 197, 94, 0.8)'; // Explorer
    default: return 'rgba(100, 116, 139, 0.5)'; // Initiate
  }
};

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
      setTimeout(() => setRevealState('level'), 1000);

    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message);
      setRevealState('closed'); 
    }
  };

  useEffect(() => {
    if (revealState === 'level') {
      const timer = setTimeout(() => setRevealState('medals'), 2000);
      return () => clearTimeout(timer);
    }
    if (revealState === 'medals') {
      const timer = setTimeout(() => setRevealState('done'), 4000);
      return () => clearTimeout(timer);
    }
  }, [revealState]);

  if (!data) return null;

  if (revealState === 'open' && fullData) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl h-[750px] perspective-[1000px]"
      >
        <OpenCardView data={fullData} />
      </motion.div>
    );
  }

  const identity = fullData?.identity || null;
  const earnedMedals = identity?.medals.filter((m: any) => m.unlocked) || [];
  
  // Show first 4 unlocked medals, or locked placeholders if none
  const displayMedals = revealState === 'closed' || revealState === 'analyzing' || !identity
    ? Array(4).fill({ unlocked: false })
    : [...earnedMedals.slice(0, 4), ...Array(Math.max(0, 4 - earnedMedals.length)).fill({ unlocked: false })].slice(0, 4);

  const levelColor = identity ? getLevelColor(identity.levelNumber) : 'rgba(100, 116, 139, 0.5)';

  return (
    <motion.div 
      className="w-full max-w-md mx-auto relative group perspective-[1000px]"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ 
          rotateX, rotateY, transformStyle: "preserve-3d",
          boxShadow: revealState === 'level' || revealState === 'medals' || revealState === 'done' 
            ? `0 0 50px ${levelColor}` 
            : '0 20px 50px rgba(11,14,20,0.8)'
        }}
        className="relative w-full rounded-2xl overflow-hidden bg-brand-surface border-[2px] backdrop-blur-xl flex flex-col items-center text-center p-8 min-h-[550px] transition-all duration-1000"
      >
        <motion.div 
          animate={{ borderColor: revealState === 'done' ? levelColor : 'rgba(42, 45, 53, 0.5)' }}
          transition={{ duration: 1 }}
          className="absolute inset-0 border-[2px] rounded-2xl pointer-events-none"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

        <div className="space-y-3 z-10 w-full mb-4" style={{ transform: "translateZ(30px)" }}>
          <div className="relative mx-auto w-24 h-24">
            <img 
              src={profile.avatarUrl} 
              alt="Avatar" 
              className="w-24 h-24 rounded-full border-4 shadow-lg relative z-10 object-cover"
              style={{ borderColor: revealState === 'done' ? levelColor : '#1A1C23' }}
            />
          </div>
          <div>
            <h2 className="text-2xl font-black text-brand-text-main tracking-tight">{profile.name || profile.login}</h2>
            <p className="text-brand-text-muted font-mono tracking-widest text-xs">@{profile.login}</p>
          </div>
        </div>

        {errorMsg && <p className="text-brand-error text-sm mb-4">{errorMsg}</p>}

        <AnimatePresence mode="popLayout">
          {(revealState === 'closed' || revealState === 'analyzing') && (
            <motion.div 
              key="locked"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full flex flex-col items-center mt-6"
              style={{ transform: "translateZ(40px)" }}
            >
              <div className="text-2xl font-black text-brand-text-muted/30 tracking-widest uppercase mb-8 flex justify-center items-center">
                <span className="w-16 h-16 bg-brand-bg/50 border-2 border-brand-border/30 rounded-full flex items-center justify-center mr-4">🔒</span> 
                Level ???
              </div>
              <div className="flex justify-center gap-4">
                {displayMedals.map((_: any, i: number) => (
                  <div key={i} className="w-16 h-16 rounded-full bg-brand-bg/50 border-2 border-brand-border/30 border-dashed flex items-center justify-center opacity-50">
                    <span className="text-xl">🔒</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {(revealState === 'level' || revealState === 'medals' || revealState === 'done') && identity && (
            <motion.div 
              key="level"
              initial={{ opacity: 0, scale: 3, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
              className="w-full flex flex-col items-center mb-6"
              style={{ transform: "translateZ(50px)" }}
            >
              <div className="flex items-center gap-4 mb-2">
                <img 
                  src={`/assets/levels/${identity.levelNumber}-${slugify(identity.level)}.png`}
                  alt={identity.level}
                  className="w-16 h-16 object-contain"
                  onError={(e) => (e.currentTarget.style.display = 'none')}
                />
                <h3 
                  className="text-3xl font-black uppercase tracking-widest"
                  style={{ color: levelColor, textShadow: `0 0 20px ${levelColor}` }}
                >
                  {identity.level}
                </h3>
              </div>
              <p className="text-sm text-brand-text-main/80 font-mono mt-1">{identity.xp.toLocaleString()} XP</p>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 border-t border-white/10 pt-4 w-full"
              >
                <p className="text-lg font-bold text-white tracking-widest uppercase">{identity.archetype}</p>
                <p className="text-xs text-brand-primary font-mono mt-1">DNA: {identity.developerDNA}</p>
              </motion.div>
            </motion.div>
          )}

          {(revealState === 'medals' || revealState === 'done') && identity && (
            <motion.div 
              key="medals"
              className="w-full pt-4"
              style={{ transform: "translateZ(60px)" }}
            >
              <p className="text-xs text-brand-text-muted font-bold uppercase tracking-widest mb-4">Top Achievements</p>
              <div className="flex flex-wrap justify-center gap-3">
                {displayMedals.map((medal: any, i: number) => (
                  <motion.div 
                    key={medal.id || i}
                    initial={{ opacity: 0, scale: 0, rotate: -180 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ delay: i * 0.4, type: 'spring', stiffness: 200, damping: 10 }}
                    className="flex flex-col items-center group relative"
                  >
                    <div className="w-14 h-14 rounded-full border-[3px] border-brand-border/30 bg-brand-bg/50 overflow-hidden flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                      {medal.unlocked ? (
                        <img 
                          src={`/assets/medals/${medal.id}.png`}
                          alt={medal.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<span class="text-xl font-black text-brand-primary">★</span>';
                          }}
                        />
                      ) : (
                        <span className="text-sm text-brand-text-muted/50">🔒</span>
                      )}
                    </div>
                    {medal.unlocked && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap bg-[#1A1C23] border border-brand-border text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        {medal.name}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

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
