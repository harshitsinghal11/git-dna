'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SCAN_STAGES = [
  'Finding developer...',
  'Scanning repositories...',
  'Analyzing activity...',
  'Measuring impact...',
  'Detecting strongest language...',
  'Calculating achievements...',
  'Building identity...'
];

export default function ScanningScreen() {
  const [currentStageIndex, setCurrentStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIndex((prev) => {
        if (prev < SCAN_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 800); // Slower interval so users can read the stages

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-md mx-auto p-12 bg-brand-surface/90 border-[2px] border-brand-border/50 rounded-2xl shadow-[0_20px_50px_rgba(11,14,20,0.8)] backdrop-blur-xl flex flex-col items-center text-center space-y-10 relative overflow-hidden"
    >
      {/* Background Radar Grid */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

      {/* Radar Animation */}
      <div className="relative w-32 h-32 flex items-center justify-center">
        {/* Outer Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full border-[2px] border-brand-primary/20 shadow-[0_0_15px_rgba(56,189,248,0.1)]" 
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-brand-primary/40 border-dashed" 
        />

        {/* Spinning Radar Sweep */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-0 rounded-full bg-gradient-to-tr from-brand-primary/0 via-brand-primary/10 to-brand-primary/50" 
          style={{ clipPath: 'polygon(50% 50%, 100% 0, 100% 100%)' }} 
        />

        {/* Center Pulse */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          className="relative w-4 h-4 rounded-full bg-brand-primary shadow-[0_0_20px_rgba(56,189,248,1)]" 
        />
      </div>

      <div className="space-y-4 z-10 w-full">
        <h3 className="text-xl font-black tracking-[0.2em] uppercase text-brand-primary shadow-brand-primary/50" style={{ textShadow: '0 0 10px rgba(56,189,248,0.3)' }}>Scanning</h3>
        
        <div className="h-6 flex items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.p 
              key={currentStageIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-xs font-mono text-brand-text-muted tracking-widest absolute"
            >
              {SCAN_STAGES[currentStageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-brand-border rounded-full overflow-hidden mt-4">
          <motion.div
            className="h-full bg-brand-primary"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStageIndex + 1) / SCAN_STAGES.length) * 100}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        </div>
      </div>

    </motion.div>
  );
}
