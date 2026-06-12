'use client';

import { UserInputs } from '@/engine/calculations';
import { Sliders } from 'lucide-react';
import { LiquidButton } from './ui/liquid-glass-button';

type Props = {
  inputs: UserInputs;
  setInputs: (inputs: UserInputs) => void;
};

export default function WhatIfSimulator({ inputs, setInputs }: Props) {
  const reduceDriving = () => {
    setInputs({ ...inputs, kilometersDrivenPerWeek: Math.max(0, inputs.kilometersDrivenPerWeek - 50) });
  };

  const switchDiet = () => {
    setInputs({ ...inputs, dietType: 'vegetarian' });
  };

  const boostRecycling = () => {
    setInputs({ ...inputs, recyclingLevel: 'high' });
  };

  return (
    <div className="py-12 flex flex-col items-center">
      <div className="flex flex-col items-center gap-4 mb-4 text-center">
        <div className="p-4 bg-emerald-950/40 backdrop-blur-md rounded-full shadow-lg border border-emerald-500/20">
          <Sliders size={32} className="text-emerald-400" />
        </div>
        <h2 className="text-5xl font-light text-white">Simulator</h2>
      </div>
      <p className="text-emerald-100/70 mb-12 font-light text-xl text-center max-w-xl">Trigger instant impact scenarios and see how your score adapts in real-time as you make changes.</p>

      <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6 w-full">
        <LiquidButton 
          variant="default"
          onClick={reduceDriving}
          className="flex-1 min-w-[250px] text-center py-8 text-xl font-bold tracking-wide text-white bg-white/10 border border-emerald-500/30 hover:bg-emerald-500/20"
        >
          Reduce Driving By 50 Km
        </LiquidButton>

        <LiquidButton 
          variant="default"
          onClick={switchDiet}
          className="flex-1 min-w-[250px] text-center py-8 text-xl font-bold tracking-wide text-white bg-white/10 border border-emerald-500/30 hover:bg-emerald-500/20"
        >
          Go Vegetarian
        </LiquidButton>

        <LiquidButton 
          variant="default"
          onClick={boostRecycling}
          className="flex-1 min-w-[250px] text-center py-8 text-xl font-bold tracking-wide text-white bg-white/10 border border-emerald-500/30 hover:bg-emerald-500/20"
        >
          Max Out Recycling
        </LiquidButton>
      </div>
    </div>
  );
}
