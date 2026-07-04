'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {/* Main Card Container */}
      <div className="w-full flex-1 flex flex-col bg-brand-surface/90 backdrop-blur-2xl border-[2px] border-brand-border/50 rounded-2xl shadow-[0_20px_50px_rgba(11,14,20,0.8)] overflow-hidden relative">
        
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
        <div className="p-8 flex-1 overflow-y-auto relative z-10 custom-scrollbar">
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
                  <img src={raw.profile.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-[3px] shadow-[0_0_20px_rgba(56,189,248,0.2)] object-cover" style={{ borderColor: levelColor }} />
                  <div>
                    <h2 className="text-3xl font-black text-brand-text-main tracking-tight">{raw.profile.name || raw.profile.login}</h2>
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {identity.medals.map((medal: any) => {
                    const isLocked = !medal.unlocked;
                    return (
                      <motion.div variants={itemVariants} key={medal.id} className={`flex flex-col p-4 bg-brand-bg/50 backdrop-blur-sm rounded-xl border transition-colors relative overflow-hidden ${isLocked ? 'border-brand-border/30 grayscale opacity-75' : 'border-white/10 hover:border-white/30'}`}>
                        <div className="flex items-center gap-4 mb-3">
                          <div className={`w-14 h-14 flex-shrink-0 rounded-full border-[2px] bg-brand-bg overflow-hidden flex items-center justify-center shadow-lg ${isLocked ? 'border-brand-border/50' : 'border-brand-primary/30'}`}>
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
                          <div>
                            <p className={`font-black text-sm uppercase tracking-wide ${isLocked ? 'text-brand-text-muted' : 'text-white'}`}>{medal.name}</p>
                            <p className={`text-[10px] font-bold uppercase tracking-wider ${isLocked ? 'text-brand-text-muted/50' : 'text-brand-primary'}`}>{isLocked ? 'Locked' : 'Unlocked'}</p>
                          </div>
                        </div>
                        <p className="text-xs text-brand-text-muted mt-auto">
                          {medal.description}
                        </p>
                        <div className="mt-3 w-full bg-[#0B0E14] h-1.5 rounded-full overflow-hidden flex relative">
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
        <button className="px-6 py-3 bg-brand-primary text-[#0B0E14] font-black uppercase tracking-widest text-xs rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.3)] hover:scale-105 transition-transform">
          Share Result
        </button>
        <button className="px-6 py-3 bg-brand-surface border border-brand-border text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:border-brand-primary/50 transition-colors">
          Download Card
        </button>
        <button className="px-6 py-3 bg-brand-surface border border-brand-border text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:border-brand-primary/50 transition-colors">
          Copy Link
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-transparent text-brand-text-muted hover:text-white font-bold uppercase tracking-widest text-xs rounded-xl transition-colors"
        >
          Replay Reveal
        </button>
      </motion.div>
    </div>
  );
}
