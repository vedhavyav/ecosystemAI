'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Users, TrendingDown, Factory, CheckCircle } from 'lucide-react';
import { LiquidButton } from '@/components/ui/liquid-glass-button';

export default function AdminClient() {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert('Mock BRSR Report (Scope 3) Downloaded successfully!');
    }, 2000);
  };

  return (
    <main className="flex flex-col items-center overflow-x-hidden font-sans relative min-h-screen bg-[#022c22]">
      
      <section className="w-full max-w-[1400px] p-6 md:p-12 pt-24 md:pt-32 pb-32">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-2">
          Corporate ESG Dashboard
        </h1>
        <p className="text-xl text-emerald-100/70 mb-12">
          Aggregate Scope 3 Commuter Emissions Overview
        </p>

        {/* High Level Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-emerald-900/40 border border-emerald-500/20 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><Users className="text-emerald-400" /></div>
              <h3 className="text-emerald-100/60 font-bold tracking-widest uppercase text-sm">Active Workforce</h3>
            </div>
            <div className="text-5xl font-black text-white">4,281</div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-500/20 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><TrendingDown className="text-emerald-400" /></div>
              <h3 className="text-emerald-100/60 font-bold tracking-widest uppercase text-sm">Avoided Emissions</h3>
            </div>
            <div className="text-5xl font-black text-white">14.2 <span className="text-2xl text-emerald-500">Tons</span></div>
          </div>

          <div className="bg-emerald-900/40 border border-emerald-500/20 p-6 rounded-3xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-emerald-500/20 rounded-xl"><Factory className="text-emerald-400" /></div>
              <h3 className="text-emerald-100/60 font-bold tracking-widest uppercase text-sm">Current Scope 3</h3>
            </div>
            <div className="text-5xl font-black text-white">480.5 <span className="text-2xl text-emerald-500">Tons</span></div>
          </div>
        </div>

        {/* BRSR Export Section */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">SEBI BRSR Compliance Export</h2>
              <p className="text-emerald-200/60">Generate an audit-ready PDF/Excel report of your workforce's Scope 3 commuter data, anonymized and differential-privacy protected.</p>
            </div>
            
            <LiquidButton 
              onClick={handleDownload} 
              disabled={downloading}
              className="whitespace-nowrap px-8 py-4 font-bold flex items-center gap-3 disabled:opacity-50"
            >
              {downloading ? 'Generating...' : (
                <>
                  <Download size={20} />
                  Download BRSR Report
                </>
              )}
            </LiquidButton>
          </div>
        </div>

      </section>
    </main>
  );
}
