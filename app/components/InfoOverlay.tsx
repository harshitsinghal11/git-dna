'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function InfoOverlay() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-10 h-10 rounded-full bg-brand-surface/50 border border-brand-border/30 flex items-center justify-center text-brand-text-muted hover:text-brand-primary hover:bg-brand-surface hover:border-brand-primary/50 transition-all z-40 backdrop-blur-sm"
        title="How it works"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 16v-4"></path>
          <path d="M12 8h.01"></path>
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#0B0E14]/80 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-surface border border-brand-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-brand-text-muted hover:text-brand-text-main transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <h2 className="text-3xl font-black text-brand-text-main uppercase tracking-widest mb-2 text-brand-primary">How it Works</h2>
              <p className="text-brand-text-muted mb-8 text-sm">Transparency in how we calculate your Developer Identity.</p>

              <div className="space-y-8">
                <section>
                  <h3 className="text-xl font-bold text-white mb-4 border-b border-brand-border pb-2">XP Calculation</h3>
                  <ul className="space-y-3 text-brand-text-muted">
                    <li className="flex items-start">
                      <span className="text-brand-primary mr-2">◆</span>
                      <span><strong>Age:</strong> 100 XP per year on GitHub (Max 1,000 XP)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-primary mr-2">◆</span>
                      <span><strong>Repositories:</strong> 20 XP per public repo (Max 2,000 XP)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-primary mr-2">◆</span>
                      <span><strong>Impact:</strong> 50 XP per star, 100 XP per follower (Uncapped)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-brand-primary mr-2">◆</span>
                      <span><strong>Medals:</strong> 500 XP per unlocked medal</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-4 border-b border-brand-border pb-2">Level Tiers</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-brand-text-muted text-sm">
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30">
                      <span className="text-white font-bold block mb-1">Initiate</span>
                      0+ XP
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30">
                      <span className="text-white font-bold block mb-1">Explorer</span>
                      1,000+ XP
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30">
                      <span className="text-white font-bold block mb-1">Builder</span>
                      2,500+ XP
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30">
                      <span className="text-white font-bold block mb-1">Craftsman</span>
                      5,000+ XP
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30">
                      <span className="text-white font-bold block mb-1">Architect</span>
                      10,000+ XP
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30">
                      <span className="text-white font-bold block mb-1">Vanguard</span>
                      25,000+ XP
                    </div>
                    <div className="bg-brand-bg/50 p-3 rounded-lg border border-brand-border/30 sm:col-span-2">
                      <span className="text-[#B9F2FF] font-bold block mb-1">Mythic</span>
                      100,000+ XP
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-xl font-bold text-white mb-4 border-b border-brand-border pb-2">Medals</h3>
                  <p className="text-brand-text-muted text-sm leading-relaxed mb-4">
                    Medals are special achievements unlocked by reaching specific milestones in your GitHub journey. Examples include:
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-brand-text-muted text-sm">
                    <li>• <strong className="text-white">Star Magnet:</strong> 50+ total stars</li>
                    <li>• <strong className="text-white">Commit Machine:</strong> 15+ public repos</li>
                    <li>• <strong className="text-white">Polygot:</strong> 5+ primary languages</li>
                    <li>• <strong className="text-white">Ancient One:</strong> 3+ years active</li>
                    <li>• <strong className="text-white">Ship It:</strong> 3+ recently updated repos</li>
                    <li>• <strong className="text-white">Open Source Ally:</strong> 10+ forks of your repos</li>
                    <li>• <strong className="text-white">Deep Diver:</strong> 10MB+ codebase size</li>
                    <li>• <strong className="text-white">Hidden Gem:</strong> High star/follower ratio</li>
                    <li>• <strong className="text-white">Maintainer:</strong> 25+ public repos</li>
                    <li>• <strong className="text-white">Specialist:</strong> 80%+ focus in one language</li>
                    <li>• <strong className="text-white">Explorer:</strong> Follows 20+ developers</li>
                    <li>• <strong className="text-white">Comeback Coder:</strong> Active again after 2+ years</li>
                  </ul>
                </section>
                
                <p className="text-center text-xs text-brand-text-muted/50 mt-8 pt-4 border-t border-brand-border/30">
                  Data is based on publicly available GitHub metrics.
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
