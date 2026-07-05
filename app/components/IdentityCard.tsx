'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OpenCardView from './OpenCardView';
import Image from 'next/image';
import { GitDNAData, Medal } from '../lib/engine';

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

export default function IdentityCard({ data }: { data: GitDNAData | null }) {
  const [revealState, setRevealState] = useState<RevealState>('closed');
  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

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

  const handleShare = async () => {
    setIsGeneratingShare(true);
    try {
      const identity = data!.identity;
      const raw = data!.raw;
      const res = await fetch('/api/share/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: raw.profile.name || raw.profile.login,
          level: identity.level,
          archetype: identity.archetype,
          xp: identity.xp,
          topLanguage: identity.topLanguage,
          medals: identity.medals.filter((m: Medal) => m.unlocked).length,
          accountAgeDays: raw.stats?.accountAgeDays,
          publicRepos: raw.stats?.publicRepos,
          totalStars: raw.stats?.totalStars
        })
      });
      const shareData = await res.json();
      if (shareData.text) {
        const url = `https://www.linkedin.com/feed/?shareActive=true&text=${encodeURIComponent(shareData.text)}`;
        window.open(url, '_blank');
      } else {
        alert('Could not generate post.');
      }
    } catch (e) {
      console.error(e);
      alert('Failed to generate LinkedIn post.');
    } finally {
      setIsGeneratingShare(false);
    }
  };

  if (!data) return null;

  if (revealState === 'open' && data) {
    return (
      <>
        {/* Share Button rendered fixed to the global viewport, decoupled from the transformed card */}
        <button 
          onClick={handleShare}
          disabled={isGeneratingShare}
          className="fixed top-4 right-4 md:top-12 md:right-12 z-50 flex items-center gap-2 p-3 rounded-xl bg-brand-surface border border-brand-border hover:bg-[#0A66C2]/20 hover:border-[#0A66C2]/50 transition-all group disabled:opacity-50 shadow-lg"
          aria-label="Share on LinkedIn"
        >
          {isGeneratingShare ? (
            <svg className="w-5 h-5 text-[#0A66C2] animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <svg className="w-5 h-5 text-brand-text-muted group-hover:text-[#0A66C2] transition-colors" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
            </svg>
          )}
          {/* Tooltip */}
          <div className="absolute top-14 right-0 w-max px-3 py-1.5 bg-[#0B0E14] border border-brand-border rounded-lg text-xs font-bold tracking-widest text-brand-text-main opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {isGeneratingShare ? 'Generating...' : 'Share on LinkedIn'}
          </div>
        </button>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-5xl h-auto min-h-[600px] perspective-[1000px] mb-12"
        >
          <OpenCardView data={data} />
        </motion.div>
      </>
    );
  }

  const identity = data?.identity || null;
  const earnedMedals = identity?.medals.filter((m: Medal) => m.unlocked) || [];
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
                  onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => (e.currentTarget.style.display = 'none')}
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
