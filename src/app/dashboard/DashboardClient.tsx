'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserInputs, calculateFootprint } from '@/engine/calculations';
import { generateRecommendations } from '@/engine/recommendations';
import Calculator3D from '@/components/Calculator3D';
import EcoScoreDisplay from '@/components/EcoScoreDisplay';
import { FootprintHistory } from '@/components/FootprintHistory';
import FlashCard from '@/components/ui/FlashCard';
import { saveFootprintEntry } from '@/engine/storage';
import { Save, CheckCircle2 } from 'lucide-react';
import GreenWallet from '@/components/GreenWallet';
import UpiModal from '@/components/UpiModal';
import RoleModal from '@/components/RoleModal';
import { useRouter } from 'next/navigation';

type Props = {
  userFirstName: string;
};

export default function DashboardClient({ userFirstName }: Props) {
  const [inputs, setInputs] = useState<UserInputs>({
    kilometersDrivenPerWeek: 250,
    vehicleType: 'petrol',
    indianZone: 'southern',
    flightHoursPerYear: 5,
    electricityKWhPerMonth: 900,
    lpgCylindersPerYear: 6,
    naturalGasThermsPerMonth: 50,
    dietType: 'average',
    recyclingLevel: 'average',
  });

  const [saved, setSaved] = useState(false);
  const [points, setPoints] = useState(0);
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const result = calculateFootprint(inputs);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('userRole')) {
      setShowRoleModal(true);
    }
    const savedPoints = localStorage.getItem('greenPoints');
    if (savedPoints) {
      setPoints(Number(savedPoints));
    }
  }, []);

  // Sync points to localStorage whenever they change (but only if > 0 to avoid overwriting initial state unnecessarily, or just do it inside the award logic)

  const handleSelectRole = (role: 'individual' | 'b2b') => {
    localStorage.setItem('userRole', role);
    window.dispatchEvent(new Event('role_updated'));
    setShowRoleModal(false);
    if (role === 'b2b') {
      router.push('/admin');
    }
  };

  const { scrollY } = useScroll();
  const backgroundDarkness = useTransform(scrollY, [0, 800], [0.5, 0.95]);

  const handleSaveEntry = () => {
    saveFootprintEntry(result);
    // Dispatch custom event to update history chart instantly
    window.dispatchEvent(new Event('ecosystem_history_updated'));
    
    // Award Green Points: baseline is 50. 
    // Earn ₹10 for every point above 50.
    const baseline = 50;
    if (result.ecoScore > baseline) {
      setPoints(prev => {
        const newPoints = prev + ((result.ecoScore - baseline) * 10);
        localStorage.setItem('greenPoints', newPoints.toString());
        return newPoints;
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main className="flex flex-col items-center overflow-x-hidden font-sans relative min-h-screen">
      
      {/* Dynamic Dark Background Overlay */}
      <motion.div 
        className="fixed inset-0 bg-[#022c22] pointer-events-none -z-40"
        style={{ opacity: backgroundDarkness }}
      />

      <section className="w-full max-w-[1400px] p-6 md:p-12 pt-24 md:pt-32 pb-32">
        <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
          Welcome back, {userFirstName}.
        </h1>
        <p className="text-xl text-emerald-100/70 mb-8 max-w-2xl">
          Here is your personalized environmental tracking dashboard. Adjust your lifestyle data below and log your progress.
        </p>

        {/* Hero Section: Green Wallet */}
        <div className="mb-16">
          <GreenWallet points={points} onRedeem={() => setShowUpiModal(true)} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10 mb-20">
          
          {/* Left Column: Calculator */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
                 style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}>
            </div>
            
            <div className="relative z-10">
              <Calculator3D inputs={inputs} setInputs={setInputs} />
            </div>
          </div>

          {/* Right Column: Live Score & Save Button */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-emerald-950/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              <EcoScoreDisplay 
                result={result} 
                recommendations={[]} 
                showTimeline={false} 
              />
              
              <div className="mt-12 flex justify-center">
                <button
                  onClick={handleSaveEntry}
                  disabled={saved}
                  className={`w-full font-bold py-5 rounded-full flex items-center justify-center gap-2 transition-all duration-300 shadow-xl ${
                    saved 
                      ? 'bg-emerald-500 text-emerald-950 scale-[0.98]' 
                      : 'bg-white hover:bg-emerald-50 text-emerald-950 hover:scale-[1.02]'
                  }`}
                >
                  {saved ? (
                    <>
                      <CheckCircle2 className="w-6 h-6" />
                      Entry Logged!
                    </>
                  ) : (
                    <>
                      <Save className="w-6 h-6" />
                      Log Current Score
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* History Chart Section */}
        <div className="w-full mb-20">
          <FootprintHistory />
        </div>

        {/* FlashCard Analysis Section */}
        <div className="w-full max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">Sustainable Journey Analysis</h2>
            <p className="text-emerald-100/70 text-lg">Flip the cards to reveal actionable insights based on your calculator entries.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {generateRecommendations(inputs, result).map((rec, i) => (
              <FlashCard 
                key={i} 
                problem={rec.description} 
                solution={rec.title} 
                difficulty={rec.difficulty} 
              />
            ))}
          </div>
        </div>

      </section>

      {/* UPI Mock Modal */}
      <UpiModal 
        isOpen={showUpiModal} 
        onClose={() => setShowUpiModal(false)} 
        amount={points} 
      />

      {/* Role Selection Modal */}
      <RoleModal 
        isOpen={showRoleModal}
        onSelectRole={handleSelectRole}
      />
    </main>
  );
}
