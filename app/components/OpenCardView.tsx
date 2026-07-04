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

export default function OpenCardView({ data }: { data: any }) {
  const [activeTab, setActiveTab] = useState<Tab>('Identity');
  
  const { identity, raw } = data;
  const levelSlug = identity.level ? slugify(identity.level) : '';

  return (
    <div className="w-full h-full flex flex-col bg-brand-surface/90 backdrop-blur-2xl border-[2px] border-brand-border/50 rounded-2xl shadow-[0_20px_50px_rgba(11,14,20,0.8)] overflow-hidden relative">
      
      {/* Glow behind the HUD */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-brand-secondary/10 pointer-events-none" />

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
                <img src={raw.profile.avatarUrl} alt="Avatar" className="w-24 h-24 rounded-full border-[3px] border-brand-primary/50 shadow-[0_0_20px_rgba(56,189,248,0.2)] object-cover" />
                <div>
                  <h2 className="text-3xl font-black text-brand-text-main tracking-tight">{raw.profile.name || raw.profile.login}</h2>
                  <p className="text-brand-primary font-mono uppercase tracking-widest text-sm">@{raw.profile.login}</p>
                  <div className="mt-2 inline-flex items-center space-x-2 bg-brand-bg px-3 py-1 rounded-full border border-brand-border">
                    <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center">
                       <img src={`/assets/levels/${levelSlug}.png`} alt={identity.level} className="w-full h-full object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                    <p className="text-xs text-brand-text-main font-bold tracking-wider">{identity.level}</p>
                  </div>
                </div>
              </motion.div>
              
              <motion.div variants={itemVariants} className="p-6 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-primary/20 text-center space-y-3 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                <h3 className="text-xl font-black text-brand-secondary uppercase tracking-[0.2em]" style={{ textShadow: '0 0 15px rgba(129,140,248,0.4)' }}>{identity.developerClass}</h3>
                <p className="text-brand-text-main/80 italic font-medium">"{identity.description}"</p>
              </motion.div>

              <motion.div variants={itemVariants} className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors">
                  <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-[0.2em] mb-1">Primary Weapon</p>
                  <p className="text-2xl font-black text-brand-primary">{identity.topLanguage}</p>
                </div>
                <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border hover:border-brand-primary/30 transition-colors">
                  <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-[0.2em] mb-1">Active Since</p>
                  <p className="text-2xl font-black text-brand-text-main">{new Date(raw.profile.createdAt).getFullYear()}</p>
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
              <motion.h3 variants={itemVariants} className="text-[10px] font-bold text-brand-text-muted uppercase tracking-[0.2em]">Unlocked Achievements</motion.h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {identity.medals.map((medal: string) => (
                  <motion.div variants={itemVariants} key={medal} className="flex items-center space-x-4 p-4 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-accent/20 hover:border-brand-accent/50 transition-colors group">
                    <div className="w-14 h-14 rounded-full bg-[#0B0E14] border border-brand-accent/30 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.1)] overflow-hidden relative">
                       <img src={`/assets/medals/${slugify(medal)}.png`} alt={medal} className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300" onError={(e) => e.currentTarget.style.display = 'none'} />
                    </div>
                    <div>
                      <p className="font-black text-brand-accent tracking-wide">{medal}</p>
                      <p className="text-[10px] text-brand-text-muted uppercase tracking-wider mt-1">Achievement Unlocked</p>
                    </div>
                  </motion.div>
                ))}
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
                <p className="text-[10px] text-brand-primary font-mono tracking-widest">TOP {raw.topRepos.length} LOGS</p>
              </motion.div>
              
              <div className="space-y-3 relative before:absolute before:inset-y-0 before:left-[19px] before:w-[2px] before:bg-brand-border">
                {raw.topRepos.map((repo: any, index: number) => (
                  <motion.div variants={itemVariants} key={repo.name} className="relative pl-12 group cursor-default">
                    {/* Timeline dot */}
                    <div className="absolute left-[15px] top-4 w-[10px] h-[10px] rounded-full bg-brand-border group-hover:bg-brand-primary group-hover:shadow-[0_0_10px_rgba(56,189,248,0.8)] transition-all z-10" />
                    
                    <div className="p-5 bg-brand-bg/50 backdrop-blur-sm rounded-xl border border-brand-border group-hover:border-brand-primary/50 transition-colors">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-brand-text-main text-lg">{repo.name}</h4>
                        <span className="text-brand-accent text-xs font-mono font-bold flex items-center gap-1 bg-brand-accent/10 px-2 py-1 rounded-md">
                          ★ {repo.stargazers_count}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-brand-primary/80 mt-2 uppercase tracking-wider">
                        {repo.language || 'SYS_UNKNOWN'}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
