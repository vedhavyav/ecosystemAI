'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

export interface TimelineItem {
  id: number;
  title: string;
  date: string;
  content: string;
  category: string;
  icon: React.ElementType;
  relatedIds: number[];
  status: 'completed' | 'in-progress' | 'pending';
  energy: number;
}

interface ProcessScrollTimelineProps {
  timelineData: TimelineItem[];
}

export default function ProcessScrollTimeline({ timelineData }: ProcessScrollTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track overall scroll progress for the central line
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start center', 'end center'],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative w-full max-w-[1400px] mx-auto py-24">
      {/* 3-Column Grid Layout. 
          Cards will be placed in the 2nd column (middle) on md+ screens. */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {/* The Central Animated Line (Visible behind the cards) */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-1 bg-white/10 -translate-x-1/2 rounded-full overflow-hidden z-0 hidden md:block">
          <motion.div
            className="w-full bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]"
            style={{ height: lineHeight, transformOrigin: 'top' }}
          />
        </div>

        {/* Timeline Items */}
        {timelineData.map((item) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false, margin: '-100px' }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="md:col-start-2 md:col-span-1 flex flex-col relative z-10 w-full mb-16 px-4 md:px-0"
              style={{ contain: 'content' }}
            >
              {/* Process Card */}
              <div className="bg-black/60 backdrop-blur-xl border border-emerald-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group hover:border-emerald-400/50 transition-colors duration-500">
                {/* Background Glow Effect */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-[50px] group-hover:bg-emerald-400/20 transition-all duration-700" />

                {/* Header: Icon & Status */}
                <div className="flex items-center justify-between mb-6 relative z-10">
                  <div className="w-14 h-14 rounded-full bg-slate-800 border-2 border-emerald-400/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-400 group-hover:text-emerald-300 transition-all duration-500 shadow-[0_0_15px_rgba(52,211,153,0)] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                    <Icon size={24} />
                  </div>

                  <div className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold tracking-[0.2em] uppercase text-emerald-300">
                    {item.status === 'completed'
                      ? 'EASY'
                      : item.status === 'in-progress'
                        ? 'MEDIUM'
                        : 'HARD'}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h4 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    {item.title}
                  </h4>
                  <p className="text-emerald-50/70 leading-relaxed font-light mb-8 text-sm">
                    {item.content}
                  </p>
                </div>

                {/* Impact Progress Bar */}
                <div className="mt-auto relative z-10">
                  <div className="flex justify-between items-center text-[10px] tracking-widest mb-3 text-emerald-400 font-mono">
                    <span>IMPACT POTENTIAL</span>
                    <span className="font-bold">{item.energy}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden border border-white/5">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${item.energy}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, delay: 0.3, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
