'use client';

import { useState } from 'react';
import { Wallet, ArrowUpRight } from 'lucide-react';
import UpiModal from './UpiModal';

type Props = {
  points: number;
  onRedeem: () => void;
};

export default function GreenWallet({ points, onRedeem }: Props) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRedeemClick = () => {
    setIsModalOpen(true);
    onRedeem();
  };

  return (
    <div className="bg-[#0f0f0f] border border-white/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between h-full min-h-[300px] hover:bg-[#141414] transition-colors relative group">
      {/* Top Brand Logo / Icon */}
      <div className="flex justify-between items-start">
        <Wallet className="text-white/80" size={28} strokeWidth={1.5} />
        <button
          onClick={handleRedeemClick}
          disabled={points <= 0}
          className="bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors disabled:opacity-30"
          title="Redeem via UPI"
        >
          <ArrowUpRight size={20} strokeWidth={2} />
        </button>
      </div>

      {/* Main Adaptive Text Content */}
      <div className="mt-8 mb-8 flex-grow flex flex-col justify-center">
        <h3 className="text-white/60 text-sm md:text-base lg:text-lg font-medium mb-2">
          Your active Green Credit balance is ready to be redeemed.
        </h3>
        <div className="text-white font-medium tracking-tight text-[clamp(2.5rem,8vw,4rem)] leading-none mb-2">
          ₹{points.toLocaleString()}
        </div>
        <p className="text-emerald-300 text-xs md:text-sm font-medium tracking-wide mt-2">
          💡 Earn ₹10 for every Eco Score point you log above the national baseline of 50. Better
          score = Higher payouts.
        </p>
      </div>

      {/* Bottom Profile / Program Info */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white/80 font-medium text-sm">
          EC
        </div>
        <div>
          <p className="text-white text-sm font-semibold">Eco Rewards</p>
          <p className="text-white/40 text-xs">Govt. backed green initiative</p>
        </div>
      </div>

      <UpiModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} amount={points} />
    </div>
  );
}
