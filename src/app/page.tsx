'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { calculateFootprint, FootprintResult, UserInputs } from '@/engine/calculations';
import { generateRecommendations, Recommendation } from '@/engine/recommendations';
import Calculator3D from '@/components/Calculator3D';
import EcoScoreDisplay from '@/components/EcoScoreDisplay';
import WhatIfSimulator from '@/components/WhatIfSimulator';
import { Leaf, Save } from 'lucide-react';
import { useAuth } from '@/lib/firebase/authContext';
import { saveFootprintRecord } from '@/lib/firebase/firestore';

export default function Home() {
  const [inputs, setInputs] = useState<UserInputs>({
    kilometersDrivenPerWeek: 250,
    vehicleType: 'petrol',
    indianZone: 'southern',
    flightHoursPerYear: 5,
    electricityKWhPerMonth: 800,
    lpgCylindersPerYear: 6,
    naturalGasThermsPerMonth: 40,
    dietType: 'average',
    recyclingLevel: 'average',
  });

  const [result, setResult] = useState<FootprintResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const res = calculateFootprint(inputs);
    setResult(res);
    setRecommendations(generateRecommendations(inputs, res));
  }, [inputs]);

  const handleSaveToProfile = async () => {
    if (!user || !result) return;
    setIsSaving(true);
    try {
      await saveFootprintRecord(user.uid, inputs, result);
      alert('Footprint successfully saved to your profile!');
    } catch (e) {
      console.error(e);
      alert('Failed to save footprint. Please try again.');
    }
    setIsSaving(false);
  };

  // Dynamic Scroll Background Darkening
  const { scrollYProgress } = useScroll();
  const backgroundDarkness = useTransform(scrollYProgress, [0, 0.4, 0.8, 1], [0.3, 0.5, 0.9, 0.95]);

  return (
    <main className="flex flex-col items-center overflow-x-hidden font-sans relative">
      {/* Unsplash Nature Background Image */}
      <div
        className="fixed inset-0 pointer-events-none -z-50 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=2000&q=80')`,
          opacity: 0.15,
        }}
      />

      {/* Dynamic Dark Background Overlay */}
      <motion.div
        className="fixed inset-0 bg-[#022c22] pointer-events-none -z-40"
        style={{ opacity: backgroundDarkness }}
      />

      {/* SECTION 1: Hero */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          className="text-center flex flex-col items-center"
        >
          <div className="p-6 bg-white/40 backdrop-blur-md rounded-full mb-8 shadow-sm border border-white/50">
            <Leaf className="w-16 h-16 text-black" strokeWidth={2} />
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-black mb-4 drop-shadow-md">
            Ecosystem <span className="text-emerald-800 font-medium">Intelligence</span>
          </h1>
          <p className="text-2xl text-slate-900 max-w-2xl font-medium drop-shadow-sm">
            An elegant, interactive way to understand and optimize your environmental footprint.
          </p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 flex flex-col items-center gap-2 text-black font-bold tracking-widest uppercase text-xs"
        >
          <span>Scroll to explore</span>
          <div className="w-px h-12 bg-black rounded-full" />
        </motion.div>
      </section>

      {/* SECTION 2: Data & Score */}
      <section className="w-full min-h-screen max-w-[1400px] p-6 md:p-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Column: Calculator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Calculator3D inputs={inputs} setInputs={setInputs} />
          </motion.div>

          {/* Right Column: Score */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {result && (
              <EcoScoreDisplay
                result={result}
                recommendations={recommendations}
                showTimeline={false}
              />
            )}
          </motion.div>
        </div>
      </section>

      {/* SECTION 3: Simulator */}
      <section className="w-full min-h-[70vh] flex flex-col justify-center items-center p-6 md:p-12 bg-white/5 border-y border-emerald-800/10 backdrop-blur-sm">
        <div className="w-full max-w-[1000px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <WhatIfSimulator inputs={inputs} setInputs={setInputs} />
          </motion.div>
        </div>
      </section>

      {/* SECTION 4: Timeline */}
      <section className="w-full min-h-screen p-6 md:p-12 flex flex-col items-center pt-24 pb-32">
        <div className="w-full max-w-[1400px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            {result && (
              <EcoScoreDisplay
                result={result}
                recommendations={recommendations}
                showScore={false}
              />
            )}

            {user && result && (
              <button
                onClick={handleSaveToProfile}
                disabled={isSaving}
                className="mt-12 flex items-center gap-2 px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold text-lg shadow-xl shadow-emerald-900/20 transition-all disabled:opacity-50"
              >
                <Save size={24} />
                {isSaving ? 'Saving...' : 'Save Record to Profile'}
              </button>
            )}
            {!user && result && (
              <p className="mt-12 text-white/50 text-sm">
                Sign in to save this footprint record to your history.
              </p>
            )}
          </motion.div>
        </div>
      </section>
    </main>
  );
}
