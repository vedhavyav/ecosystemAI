'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, AlertCircle } from 'lucide-react';

type Props = {
  problem: string;
  solution: string;
  difficulty?: string;
};

export default function FlashCard({ problem, solution, difficulty }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="relative w-full h-[250px] cursor-pointer perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 20 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front (Problem) */}
        <div
          className="absolute inset-0 backface-hidden bg-[#111] border border-red-500/20 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-lg hover:border-red-500/40 transition-colors"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="text-red-400 w-6 h-6" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">The Problem</h3>
          <p className="text-white/70">{problem}</p>
          <p className="text-white/30 text-sm mt-6 font-medium tracking-widest uppercase">
            Click to flip
          </p>
        </div>

        {/* Back (Solution) */}
        <div
          className="absolute inset-0 backface-hidden bg-emerald-950 border border-emerald-500/30 rounded-3xl p-6 md:p-8 flex flex-col justify-center items-center text-center shadow-lg hover:border-emerald-500/50 transition-colors"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-4">
            <Lightbulb className="text-emerald-400 w-6 h-6" />
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">The Solution</h3>
          <p className="text-emerald-100/80">{solution}</p>
          {difficulty && (
            <span className="mt-6 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-xs font-bold text-emerald-300 uppercase tracking-widest">
              Impact: {difficulty}
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
