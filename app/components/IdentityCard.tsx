'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenCardView from './OpenCardView';
import Image from 'next/image';

type RevealState = 'closed' | 'analyzing' | 'level' | 'medals' | 'open';

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const getLevelColor = (levelNumber: number) => {
  switch (levelNumber) {
    case 7: return 'rgba(185, 242, 255, 0.8)';
    case 6: return 'rgba(239, 68, 68, 0.8)';
    case 5: return 'rgba(249, 115, 22, 0.8)';
    case 4: return 'rgba(168, 85, 247, 0.8)';
    case 3: return 'rgba(56, 189, 248, 0.8)';
    case 2: return 'rgba(34, 197, 94, 0.8)';
    default: return 'rgba(100, 116, 139, 0.5)';
  }
};

export default function IdentityCard({ data }: { data: any }) {
  const [revealState, setRevealState] = useState<RevealState>('closed');

  useEffect(() => {
    if (revealState === 'level' || revealState === 'medals') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [revealState]);

  const profile = data?.raw?.profile;



  const startAnalysis = () => {
    setRevealState('level');
  };

  if (!data) return null;

  if (revealState === 'open' && data) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-5xl h-auto min-h-[600px] perspective-[1000px] mb-12"
      >
        <OpenCardView data={data} />
      </motion.div>
    );
  }

  const identity = data?.identity || null;
  const earnedMedals = identity?.medals.filter((m: any) => m.unlocked) || [];
  const levelColor = identity ? getLevelColor(identity.levelNumber) : 'rgba(100, 116, 139, 0.5)';

  return (
    <>
      <motion.div
        className="w-full max-w-md mx-auto relative group perspective-[1000px]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          style={{
            boxShadow: '0 20px 50px rgba(11,14,20,0.8)'
          }}
          className="relative w-full rounded-2xl overflow-hidden bg-brand-surface border-[2px] backdrop-blur-xl flex flex-col items-center text-center p-8 min-h-[550px] transition-all duration-1000"
        >
          <motion.div
            className="absolute inset-0 border-[2px] border-[#2A2D35]/50 rounded-2xl pointer-events-none"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none" />

          <div className="space-y-3 z-10 w-full mb-4">
            <div className="relative mx-auto w-24 h-24">
              <Image
                src={profile?.avatarUrl || ''}
                alt="Avatar"
                fill
                sizes="96px"
                className="rounded-full border-4 shadow-lg relative z-10 object-cover border-[#1A1C23]"
              />
            </div>
            <div>
              <h2 className="text-2xl font-black text-brand-text-main tracking-tight">{profile?.name || profile?.login || 'Unknown'}</h2>
              <p className="text-brand-text-muted font-mono tracking-widest text-xs">@{profile?.login || 'unknown'}</p>
            </div>
          </div>

          <motion.div
            className="w-full flex flex-col items-center mt-6"
          >
            <div className="text-2xl font-black text-brand-text-muted/30 tracking-widest uppercase mb-8 flex justify-center items-center">
              <span className="w-16 h-16 bg-brand-bg/50 border-2 border-brand-border/30 rounded-full flex items-center justify-center mr-4">🔒</span>
              Level ???
            </div>
            <div className="flex justify-center gap-4">
              {Array(4).fill(0).map((_, i) => (
                <div key={i} className="w-16 h-16 rounded-full bg-brand-bg/50 border-2 border-brand-border/30 border-dashed flex items-center justify-center opacity-50">
                  <span className="text-xl">🔒</span>
                </div>
              ))}
            </div>
          </motion.div>

          <div className="pt-8 w-full mt-auto">
            {revealState === 'closed' ? (
              <button
                onClick={startAnalysis}
                className="w-full py-4 bg-brand-primary text-[#0B0E14] hover:scale-105 rounded-xl font-black tracking-widest transition-all uppercase text-sm shadow-[0_0_20px_rgba(56,189,248,0.3)]"
              >
                Reveal My Identity
              </button>
            ) : (
              <div className="w-full py-4 text-brand-primary text-sm tracking-widest animate-pulse font-bold border border-transparent">
                ANALYZING GITHUB DATA...
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* FULL SCREEN OVERLAYS */}
      <AnimatePresence>
        {revealState === 'level' && identity && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRevealState('open')}
            className="fixed inset-0 z-50 bg-[#0B0E14]/90 backdrop-blur-xl flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", bounce: 0.5, duration: 1 }}
              className="flex flex-col items-center"
            >
              <motion.div className="mb-8 relative w-64 h-64">
                <motion.img
                  animate={{
                    filter: [
                      `drop-shadow(0 0 0px ${levelColor})`,
                      `drop-shadow(0 0 100px ${levelColor})`,
                      `drop-shadow(0 0 50px ${levelColor})`
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                  src={`/assets/levels/${identity.levelNumber}-${slugify(identity.level)}.png`}
                  alt={identity.level}
                  className="w-full h-full object-contain relative z-10"
                  onError={(e: any) => (e.currentTarget.style.display = 'none')}
                />
              </motion.div>
              <h1 className="text-6xl md:text-8xl font-black uppercase tracking-[0.2em] mb-4 text-center" style={{ color: levelColor, textShadow: `0 0 30px ${levelColor}` }}>
                {identity.level}
              </h1>
              <p className="text-2xl text-white font-mono tracking-widest uppercase opacity-80">{identity.xp.toLocaleString()} XP ACHIEVED</p>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="absolute bottom-12 text-brand-text-muted font-bold tracking-widest uppercase animate-pulse"
              >
                Click Anywhere To Continue
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
