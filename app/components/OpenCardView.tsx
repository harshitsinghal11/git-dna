'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

type Tab = 'Identity' | 'Medals' | 'Journey';

const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

const tabVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, staggerChildren: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const itemVariants = {
  initial: { opacity: 0, x: -10 },
  animate: { opacity: 1, x: 0 }
};

const getLevelColor = (levelNumber: number) => {
  switch (levelNumber) {
    case 7: return 'rgba(185, 242, 255, 1)'; // Mythic
    case 6: return 'rgba(239, 68, 68, 1)'; // Vanguard
    case 5: return 'rgba(249, 115, 22, 1)'; // Architect
    case 4: return 'rgba(168, 85, 247, 1)'; // Craftsman
    case 3: return 'rgba(56, 189, 248, 1)'; // Builder
    case 2: return 'rgba(34, 197, 94, 1)'; // Explorer
    default: return 'rgba(148, 163, 184, 1)'; // Initiate
  }
};

export default function OpenCardView({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('Identity');
  
  const { identity, raw } = data;
  const levelColor = getLevelColor(identity.levelNumber);

  const [isGeneratingShare, setIsGeneratingShare] = useState(false);

  const handleShare = async () => {
    setIsGeneratingShare(true);
    try {
      const res = await fetch('/api/share/linkedin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: raw.profile.name || raw.profile.login,
          level: identity.level,
          archetype: identity.archetype,
          xp: identity.xp,
          topLanguage: identity.topLanguage,
          medals: identity.medals.filter((m: any) => m.unlocked).length
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

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Main Card Container */}
      <div className="w-full flex-1 flex flex-col bg-brand-surface/90 backdrop-blur-2xl border-[2px] border-brand-border/50 rounded-2xl overflow-hidden relative">
        
        {/* Glow behind the HUD */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(circle at 50% -20%, ${levelColor}20 0%, transparent 70%)` }} />

        {/* Tab Navigation */}
        <div className="flex border-b border-brand-border/50 bg-[#0B0E14]/80 backdrop-blur-md relative z-10">
          {['Identity', 'Medals', 'Journey'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as Tab)}
              className={`flex-1 py-5 text-xs font-black tracking-[0.2em] uppercase transition-all duration-300 relative ${
                activeTab === tab 
                  ? 'text-brand-primary' 
                  : 'text-brand-text-muted hover:text-brand-text-main hover:bg-white/5'
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-primary shadow-[0_0_15px_rgba(56,189,248,0.8)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-8 flex-1 relative z-10">
          <AnimatePresence mode="wait">
            
            {/* IDENTITY TAB */}
            {activeTab === 'Identity' && (
              <motion.div 
                key="Identity"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-8"
              >
                <motion.div variants={itemVariants} className="flex items-center space-x-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image src={raw.profile.avatarUrl} alt="Avatar" fill sizes="96px" className="rounded-full border-[3px] shadow-[0_0_20px_rgba(56,189,248,0.2)] object-cover" style={{ borderColor: levelColor }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <h2 className="text-3xl font-black text-brand-text-main tracking-tight">{raw.profile.name || raw.profile.login}</h2>
                      <div className="flex items-center gap-1">
                        {identity.medals.filter((m: any) => m.unlocked).slice(0, 3).map((m: any) => (
                          <div key={m.id} title={m.name} className="w-6 h-6">
                            <img src={`/assets/medals/${m.id}.png`} alt={m.name} className="w-full h-full object-contain" onError={(e: any) => e.currentTarget.style.display = 'none'} />
                          </div>
                        ))}
                        {identity.medals.filter((m: any) => m.unlocked).length > 3 && (
                          <span className="text-[10px] text-brand-text-muted ml-1 font-bold">+{identity.medals.filter((m: any) => m.unlocked).length - 3}</span>
                        )}
                      </div>
                    </div>
                    <p className="text-brand-primary font-mono uppercase tracking-widest text-sm mb-2">@{raw.profile.login}</p>
                    <div className="inline-flex items-center space-x-3 bg-brand-bg px-4 py-1.5 rounded-full border border-brand-border">
                      <div className="flex items-center gap-2">
                        <img 
                          src={`/assets/levels/${identity.levelNumber}-${slugify(identity.level)}.png`}
                          alt={identity.level}
                          className="w-5 h-5 object-contain"
                          onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <p className="text-sm font-black tracking-widest uppercase" style={{ color: levelColor }}>{identity.level}</p>
                      </div>
                      <span className="w-1 h-1 rounded-full bg-brand-text-muted" />
                      <p className="text-xs text-brand-text-muted font-mono">{identity.xp.toLocaleString()} XP</p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div variants={itemVariants} className="p-6 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors text-center space-y-3 relative overflow-hidden group">
                  <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">{identity.archetype}</h3>
                  <p className="text-brand-text-main/80 italic font-medium">"{identity.description}"</p>
                </motion.div>

                <motion.div variants={itemVariants} className="grid grid-cols-3 gap-4">
                  <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-[0.2em] mb-2">DNA Sequence</p>
                    <p className="text-sm font-black text-brand-primary tracking-widest">{identity.developerDNA}</p>
                  </div>
                  <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-[0.2em] mb-2">Primary Lang</p>
                    <p className="text-sm font-black text-white uppercase tracking-widest">{identity.topLanguage}</p>
                  </div>
                  <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors flex flex-col items-center justify-center text-center">
                    <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-[0.2em] mb-2">Active Since</p>
                    <p className="text-lg font-black text-brand-text-main">{new Date(raw.profile.createdAt).getFullYear()}</p>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* MEDALS TAB */}
            {activeTab === 'Medals' && (
              <motion.div 
                key="Medals"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                <motion.div variants={itemVariants} className="flex justify-between items-end mb-4">
                  <h3 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">All Achievements</h3>
                  <p className="text-[10px] text-brand-primary font-mono tracking-widest">{identity.medals.filter((m: any) => m.unlocked).length} / 12 UNLOCKED</p>
                </motion.div>
                
                {/* Increased gap and grid adjustments to reduce congestion */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {identity.medals.map((medal: any) => {
                    const isLocked = !medal.unlocked;
                    return (
                      <motion.div variants={itemVariants} key={medal.id} className={`flex flex-col p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border transition-colors relative overflow-hidden ${isLocked ? 'border-brand-border/30 grayscale opacity-75' : 'border-white/10 hover:border-white/30 shadow-[0_0_15px_rgba(255,255,255,0.05)]'}`}>
                        <div className="flex items-center gap-5 mb-4">
                          <div className={`w-16 h-16 flex-shrink-0 rounded-full border-[2px] bg-brand-bg overflow-hidden flex items-center justify-center shadow-lg ${isLocked ? 'border-brand-border/50' : 'border-brand-primary/30'}`}>
                            {isLocked ? (
                               <span className="text-xl">🔒</span>
                            ) : (
                               <img 
                                src={`/assets/medals/${medal.id}.png`}
                                alt={medal.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  e.currentTarget.parentElement!.innerHTML = '<span class="text-2xl font-black text-brand-primary">★</span>';
                                }}
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`font-black text-sm uppercase tracking-wide leading-tight mb-1 ${isLocked ? 'text-brand-text-muted' : 'text-white'}`}>{medal.name}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isLocked ? 'text-brand-text-muted/50' : 'text-brand-primary'}`}>{isLocked ? 'Locked' : 'Unlocked'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-brand-text-muted leading-relaxed mt-auto">
                          {medal.description}
                        </p>
                        <div className="mt-4 w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden flex relative">
                          {isLocked && medal.requirement ? (
                            <>
                              <div className="h-full bg-brand-border" style={{ width: `${Math.min(100, (medal.progress / medal.requirement) * 100)}%` }} />
                              <span className="absolute -top-4 right-0 text-[9px] font-mono text-brand-text-muted">{medal.progress} / {medal.requirement}</span>
                            </>
                          ) : (
                            <div className="h-full bg-gradient-to-r from-brand-primary to-brand-secondary w-full" />
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* JOURNEY TAB */}
            {activeTab === 'Journey' && (
              <motion.div 
                key="Journey"
                variants={tabVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                className="space-y-6"
              >
                 <motion.div variants={itemVariants} className="flex justify-between items-end mb-2">
                  <h3 className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">The Constellation</h3>
                  <p className="text-[10px] text-brand-primary font-mono tracking-widest">TOP {raw.topRepos.length} REPOSITORIES</p>
                </motion.div>
                
                <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-brand-border">
                  {raw.topRepos.map((repo: any) => (
                    <motion.div variants={itemVariants} key={repo.name} className="relative pl-12 group cursor-default">
                      {/* Timeline dot */}
                      <div className="absolute left-[15px] top-6 w-[10px] h-[10px] rounded-full bg-brand-border group-hover:bg-brand-primary group-hover:shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-all z-10" />
                      
                      <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border group-hover:border-brand-primary/50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white text-lg">{repo.name}</h4>
                          <span className="text-brand-accent text-xs font-mono font-bold flex items-center gap-1 bg-brand-accent/10 px-2 py-1 rounded-md">
                            ★ {repo.stargazers_count}
                          </span>
                        </div>
                        {repo.description && <p className="text-sm text-brand-text-muted mb-3">{repo.description}</p>}
                        <div className="flex items-center gap-4 text-xs font-mono text-brand-primary/80 uppercase tracking-wider">
                          <span>{repo.language || 'SYS_UNKNOWN'}</span>
                          <span>•</span>
                          <span>{new Date(repo.created_at).getFullYear()}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Final Actions */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="w-full flex justify-center gap-4"
      >
        <button 
          onClick={handleShare}
          disabled={isGeneratingShare}
          className="px-8 py-4 w-full md:w-auto bg-brand-primary text-[#0B0E14] font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 hover:shadow-[0_0_30px_rgba(56,189,248,0.5)] transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
        >
          {isGeneratingShare ? (
             <span className="animate-pulse">Generating Post...</span>
          ) : (
            <>Share Identity</>
          )}
        </button>
      </motion.div>
    </div>
  );
}
