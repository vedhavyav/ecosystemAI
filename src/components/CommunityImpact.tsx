'use client';

import { motion } from 'framer-motion';
import { getCommunityStats } from '@/lib/firebase/firestore';
import useSWR from 'swr';

export function CommunityImpact() {
  const { data: stats } = useSWR('communityStats', getCommunityStats);

  if (!stats) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="h-24 bg-slate-200 rounded-2xl w-48"></div>
          <div className="h-24 bg-slate-200 rounded-2xl w-48"></div>
          <div className="h-24 bg-slate-200 rounded-2xl w-48"></div>
        </div>
      </div>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      className="max-w-4xl mx-auto my-16 px-4"
    >
      <h2 className="text-3xl font-black text-center mb-8 text-slate-800">Community Impact</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-sm border border-slate-100">
          <div className="text-5xl font-black text-emerald-600 mb-2">
            {stats.tonsSaved.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
            Tons CO₂ Saved
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-sm border border-slate-100">
          <div className="text-5xl font-black text-emerald-600 mb-2">
            {stats.treesEquivalent.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
            Trees Planted Eq.
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 text-center shadow-sm border border-slate-100">
          <div className="text-5xl font-black text-emerald-600 mb-2">
            {stats.activeUsers.toLocaleString()}
          </div>
          <div className="text-sm text-slate-500 uppercase tracking-wider font-semibold">
            Active Users
          </div>
        </div>
      </div>
    </motion.section>
  );
}
