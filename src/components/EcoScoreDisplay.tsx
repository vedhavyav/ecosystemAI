'use client';

import { FootprintResult } from '@/engine/types';
import { Recommendation } from '@/engine/recommendations';
import { motion, useReducedMotion } from 'framer-motion';
import React from 'react';
import { Sparkles, Leaf, Zap, Globe, Recycle } from 'lucide-react';
import ProcessScrollTimeline, { TimelineItem } from './ui/process-scroll-timeline';
import { calculateSvgDashOffset } from '@/services/ui-math';

type Props = {
  result: FootprintResult;
  recommendations: Recommendation[];
  showScore?: boolean;
  showTimeline?: boolean;
};

import { useAnimatedValue } from '@/hooks/useAnimatedValue';

const EcoScoreDisplay = React.memo(function EcoScoreDisplay({
  result,
  recommendations = [],
  showScore = true,
  showTimeline = true,
}: Props) {
  const dashArray = 283;
  const dashOffset = calculateSvgDashOffset(result.ecoScore, dashArray);
  const shouldReduceMotion = useReducedMotion();
  const animatedScore = useAnimatedValue(result.ecoScore, shouldReduceMotion ? 0 : 1500);

  // Map recommendations to the TimelineItem format
  const timelineData: TimelineItem[] = recommendations.slice(0, 5).map((rec, index) => {
    const desc = (rec.description + rec.title).toLowerCase();
    // ponytail: regex ternary over if/else chain
    const Icon = /energy|electric|power/.test(desc)
      ? Zap
      : /diet|meat|food/.test(desc)
        ? Leaf
        : /flight|transit|driv/.test(desc)
          ? Globe
          : /recyc|waste/.test(desc)
            ? Recycle
            : Sparkles;

    return {
      id: index + 1,
      title: rec.title,
      date: `Impact Score: ${rec.impactScore}/10`,
      content: rec.description,
      category: rec.difficulty,
      icon: Icon,
      relatedIds: index < recommendations.length - 1 ? [index + 2] : [],
      status:
        rec.difficulty === 'Easy'
          ? 'completed'
          : rec.difficulty === 'Medium'
            ? 'in-progress'
            : 'pending',
      energy: rec.impactScore * 10,
    };
  });

  return (
    <div className="space-y-12">
      {/* Score Section */}
      {showScore && (
        <div
          className="flex flex-col items-center justify-center relative py-8"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-white/40 rounded-full blur-[80px] pointer-events-none -z-10" />

          <h2 className="text-black font-black mb-8 uppercase tracking-[0.3em] text-xs relative z-10 drop-shadow-sm">
            Your Eco Score
          </h2>

          <div
            className="relative w-56 h-56 flex items-center justify-center"
            role="progressbar"
            aria-valuenow={result.ecoScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Eco Score"
          >
            <svg
              className="absolute w-full h-full transform -rotate-90 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              viewBox="0 0 100 100"
              aria-hidden="true"
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
              <motion.circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="url(#gradient)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={dashArray}
                initial={{ strokeDashoffset: shouldReduceMotion ? dashOffset : dashArray }}
                animate={{ strokeDashoffset: dashOffset }}
                transition={{ duration: shouldReduceMotion ? 0 : 1.5, ease: 'easeOut' }}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#022c22" />
                  <stop offset="100%" stopColor="#064e3b" />
                </linearGradient>
              </defs>
            </svg>
            <div className="flex flex-col items-center justify-center z-10">
              <motion.span
                key={result.ecoScore}
                initial={{
                  scale: shouldReduceMotion ? 1 : 0.8,
                  opacity: shouldReduceMotion ? 1 : 0,
                }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-7xl md:text-8xl font-black text-black tracking-tighter drop-shadow-sm"
              >
                {animatedScore}
              </motion.span>
            </div>
          </div>

          <motion.div
            key={result.level}
            initial={{ y: shouldReduceMotion ? 0 : 20, opacity: shouldReduceMotion ? 1 : 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="mt-8 mb-4"
          >
            <span className="text-lg md:text-xl whitespace-nowrap font-black tracking-widest text-black uppercase bg-white/60 backdrop-blur-md px-5 py-1.5 rounded-full border border-white/80 shadow-sm drop-shadow-sm">
              {result.level}
            </span>
          </motion.div>

          <div className="text-center relative z-10 mt-2">
            <p className="text-slate-900 text-lg font-bold uppercase tracking-widest">
              <strong className="font-black text-4xl text-black block mb-1">
                {result.totalCO2eTons.toFixed(2)}
              </strong>{' '}
              Tons CO₂e / Yr
            </p>
            <p className="text-emerald-900 font-bold mt-4 text-sm md:text-base max-w-[320px] mx-auto bg-emerald-100/80 p-3 rounded-xl border border-emerald-300 shadow-sm">
              {result.ecoScore > 70
                ? '🌟 You are performing 15% better than the average user in your zone!'
                : '📈 You are currently below the zone average. See recommendations below to improve!'}
            </p>

            {/* Category Breakdown Bar */}
            <div className="mt-8 w-full max-w-[280px] md:max-w-sm mx-auto">
              <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-2 text-left">
                Emissions Breakdown
              </h4>
              <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden flex shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)] border border-black/5">
                <div
                  style={{
                    width: `${(result.categories.transportation / result.totalCO2eKg) * 100}%`,
                  }}
                  className="bg-blue-500 h-full hover:opacity-80 transition-opacity cursor-help"
                  title={`Transportation: ${(result.categories.transportation / 1000).toFixed(2)}T`}
                />
                <div
                  style={{ width: `${(result.categories.homeEnergy / result.totalCO2eKg) * 100}%` }}
                  className="bg-amber-500 h-full hover:opacity-80 transition-opacity cursor-help"
                  title={`Home Energy: ${(result.categories.homeEnergy / 1000).toFixed(2)}T`}
                />
                <div
                  style={{ width: `${(result.categories.diet / result.totalCO2eKg) * 100}%` }}
                  className="bg-emerald-500 h-full hover:opacity-80 transition-opacity cursor-help"
                  title={`Diet: ${(result.categories.diet / 1000).toFixed(2)}T`}
                />
                <div
                  style={{ width: `${(result.categories.waste / result.totalCO2eKg) * 100}%` }}
                  className="bg-slate-600 h-full hover:opacity-80 transition-opacity cursor-help"
                  title={`Waste: ${(result.categories.waste / 1000).toFixed(2)}T`}
                />
              </div>
              <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 mt-2 px-1">
                <span className="text-blue-600">Trans</span>
                <span className="text-amber-600">Energy</span>
                <span className="text-emerald-600">Diet</span>
                <span className="text-slate-600">Waste</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll Timeline for Insights */}
      {showTimeline && (
        <div className="relative overflow-hidden py-12">
          <h3 className="text-4xl md:text-5xl font-light text-white mb-4 flex items-center gap-4 relative z-10 justify-center">
            <Sparkles size={32} className="text-emerald-300" /> Sustainable Journey
          </h3>
          <p className="text-emerald-50/90 mb-8 text-xl font-light relative z-10 text-center">
            Scroll down to explore your recommended actions.
          </p>
          <div className="w-full relative -mx-4">
            {timelineData.length > 0 && <ProcessScrollTimeline timelineData={timelineData} />}
          </div>
        </div>
      )}
    </div>
  );
});

export default EcoScoreDisplay;
