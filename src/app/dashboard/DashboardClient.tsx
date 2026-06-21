'use client';

import { useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { UserInputs } from '@/engine/types';
import { useFootprintCalculation } from '@/hooks/useFootprintCalculation';
import dynamic from 'next/dynamic';

const Calculator3D = dynamic(() => import('@/components/Calculator3D'), { ssr: false });
const EcoScoreDisplay = dynamic(() => import('@/components/EcoScoreDisplay'), { ssr: false });
const FootprintHistory = dynamic(
  () => import('@/components/FootprintHistory').then((mod) => mod.FootprintHistory),
  { ssr: false }
);
const ProcessScrollTimeline = dynamic(() => import('@/components/ui/process-scroll-timeline'), {
  ssr: false,
});
import { TimelineItem } from '@/components/ui/process-scroll-timeline';
import { saveFootprintRecord } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/firebase/authContext';
import { Save, CheckCircle2, Map, Sparkles, Leaf, Zap, Globe, Recycle } from 'lucide-react';
import GreenWallet from '@/components/GreenWallet';
import UpiModal from '@/components/UpiModal';
import RoleModal from '@/components/RoleModal';
import { useRouter } from 'next/navigation';
const LocalImpactMap = dynamic(() => import('@/components/LocalImpactMap'), { ssr: false });

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
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [showRoleModal, setShowRoleModal] = useState(() => {
    if (typeof window !== 'undefined') {
      return !localStorage.getItem('userRole');
    }
    return false;
  });

  const { result, recommendations } = useFootprintCalculation(inputs);

  const timelineData: TimelineItem[] = recommendations.slice(0, 5).map((rec, index) => {
    const desc = (rec.description + rec.title).toLowerCase();
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

  const [points, setPoints] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedPoints = localStorage.getItem('greenPoints');
      return savedPoints ? Number(savedPoints) : 0;
    }
    return 0;
  });

  const router = useRouter();
  const { user } = useAuth();

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

  const handleSaveEntry = async () => {
    if (!user) {
      alert('Please sign in to log your score.');
      return;
    }
    if (!result) return;

    await saveFootprintRecord(user.uid, inputs, result);

    // Force a re-fetch in FootprintHistory by dispatching an event, or we can just let React handle it.
    // Actually FootprintHistory currently fetches on mount or when user changes.
    // For a quick fix, dispatching a custom event is fine:
    window.dispatchEvent(new Event('ecosystem_history_updated'));

    // Award Green Points: baseline is 50.
    const baseline = 50;
    if (result.ecoScore > baseline) {
      setPoints((prev) => {
        const newPoints = prev + (result.ecoScore - baseline) * 10;
        localStorage.setItem('greenPoints', newPoints.toString());
        return newPoints;
      });
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <main
      id="main-content"
      className="flex flex-col items-center overflow-x-hidden font-sans relative min-h-screen"
    >
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
          Here is your personalized environmental tracking dashboard. Adjust your lifestyle data
          below and log your progress.
        </p>

        {/* Hero Section: Green Wallet */}
        <div className="mb-16">
          <GreenWallet points={points} onRedeem={() => setShowUpiModal(true)} />
        </div>

        {/* Actionable UX: Local Impact Map */}
        {result && (
          <div className="mb-20">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-500/20">
                <Map className="w-8 h-8 text-emerald-800" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">Local Impact & Action</h2>
                <p className="text-emerald-100/70 font-light">
                  Real-time environmental data and localized recommendations.
                </p>
              </div>
            </div>
            <LocalImpactMap result={result} />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 relative z-10 mb-20">
          {/* Left Column: Calculator */}
          <div className="lg:col-span-7 bg-white/70 backdrop-blur-xl border border-white/80 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] relative overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-50"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            ></div>

            <div className="relative z-10">
              <Calculator3D inputs={inputs} setInputs={setInputs} />
            </div>
          </div>

          {/* Right Column: Live Score & Save Button */}
          <div className="lg:col-span-5 flex flex-col gap-8">
            <div className="bg-emerald-950/40 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
              {result ? (
                <EcoScoreDisplay result={result} recommendations={[]} showTimeline={false} />
              ) : (
                <div className="flex flex-col items-center justify-center py-8 opacity-50">
                  <div className="w-48 h-48 rounded-full border-8 border-white/10 border-t-white/30 animate-spin mb-8"></div>
                  <div className="h-6 w-32 bg-white/20 rounded-full animate-pulse mb-6"></div>
                  <div className="h-4 w-48 bg-white/10 rounded-full animate-pulse"></div>
                </div>
              )}

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
                    <motion.div
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, rotate: [0, 10, -10, 0] }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-6 h-6" />
                      Entry Logged!
                    </motion.div>
                  ) : (
                    <>
                      <Save className="w-6 h-6 group-hover:-translate-y-1 transition-transform" />
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
            <h2 className="text-3xl md:text-5xl font-light text-white mb-4">
              Sustainable Journey Analysis
            </h2>
            <p className="text-emerald-100/70 text-lg">
              Scroll down to explore your recommended actions.
            </p>
          </div>
          <div className="w-full relative -mx-4">
            {result && timelineData.length > 0 ? (
              <ProcessScrollTimeline timelineData={timelineData} />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 opacity-60">
                <div className="md:col-start-2 bg-white/5 border border-white/10 rounded-[2rem] p-8 h-64 animate-pulse flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                    <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                  </div>
                  <div>
                    <div className="w-3/4 h-6 bg-white/20 rounded mb-4"></div>
                    <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                    <div className="w-5/6 h-4 bg-white/10 rounded"></div>
                  </div>
                </div>
                <div className="md:col-start-2 bg-white/5 border border-white/10 rounded-[2rem] p-8 h-64 animate-pulse flex flex-col justify-between">
                  <div className="flex justify-between items-center">
                    <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                    <div className="w-16 h-6 bg-white/10 rounded-full"></div>
                  </div>
                  <div>
                    <div className="w-3/4 h-6 bg-white/20 rounded mb-4"></div>
                    <div className="w-full h-4 bg-white/10 rounded mb-2"></div>
                    <div className="w-5/6 h-4 bg-white/10 rounded"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* UPI Mock Modal */}
      <UpiModal isOpen={showUpiModal} onClose={() => setShowUpiModal(false)} amount={points} />

      {/* Role Selection Modal */}
      <RoleModal isOpen={showRoleModal} onSelectRole={handleSelectRole} />
    </main>
  );
}
