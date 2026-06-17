'use client';

import { UserInputs } from '@/engine/calculations';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import React, { useState } from 'react';
import { Car, Zap, Utensils, Recycle } from 'lucide-react';
import { TubelightTabs } from './ui/tubelight-tabs';

type Props = {
  inputs: UserInputs;
  setInputs: (inputs: UserInputs) => void;
};

const tabs = [
  { id: 'transport', label: 'Transport', icon: Car },
  { id: 'energy', label: 'Energy', icon: Zap },
  { id: 'diet', label: 'Diet', icon: Utensils },
  { id: 'waste', label: 'Waste', icon: Recycle },
];

const Calculator3D = React.memo(function Calculator3D({ inputs, setInputs }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const shouldReduceMotion = useReducedMotion();

  const updateInput = <K extends keyof UserInputs>(key: K, value: UserInputs[K]) => {
    setInputs({ ...inputs, [key]: value });
  };

  return (
    <div className="py-2">
      <h2 className="text-3xl md:text-4xl font-black mb-6 text-black border-b-2 border-black/10 pb-3">
        Lifestyle Data
      </h2>

      <TubelightTabs
        items={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
        className="mb-8 scale-90 origin-left"
      />

      <div className="min-h-[280px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: shouldReduceMotion ? 0 : -10 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
            className="space-y-6"
          >
            {activeTab === 'transport' && (
              <>
                <div>
                  <label
                    htmlFor="input-kilometers"
                    className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm"
                  >
                    Kilometers Driven Per Week
                  </label>
                  <div className="relative">
                    <input
                      id="input-kilometers"
                      type="number"
                      min="0"
                      step="10"
                      aria-label="Kilometers Driven Per Week"
                      value={inputs.kilometersDrivenPerWeek}
                      onChange={(e) =>
                        updateInput(
                          'kilometersDrivenPerWeek',
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-full p-3 pl-6 text-black font-black text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-sm">
                      km
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { id: 'petrol', label: 'Petrol Car' },
                      { id: 'diesel', label: 'Diesel Car' },
                      { id: 'twoWheeler', label: 'Two Wheeler (Bike/Scooter)' },
                      { id: 'electric', label: 'Electric Vehicle' },
                      { id: 'publicTransit', label: 'Public Transit' },
                    ].map((type) => (
                      <button
                        key={type.id}
                        aria-pressed={inputs.vehicleType === type.id}
                        aria-label={`Select vehicle type: ${type.label}`}
                        onClick={() =>
                          updateInput('vehicleType', type.id as UserInputs['vehicleType'])
                        }
                        className={`p-4 font-black text-sm md:text-base capitalize transition-all text-center rounded-full border-2 ${
                          inputs.vehicleType === type.id
                            ? 'border-emerald-600 text-emerald-950 bg-white/80 shadow-md transform scale-[1.02]'
                            : 'border-white/50 text-slate-800 bg-white/40 hover:bg-white/60 hover:text-black hover:border-emerald-500'
                        } ${type.id === 'twoWheeler' ? 'col-span-2 md:col-span-1' : ''}`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="input-flight"
                    className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm"
                  >
                    Flight Hours Per Year
                  </label>
                  <div className="relative">
                    <input
                      id="input-flight"
                      type="number"
                      min="0"
                      max="200"
                      aria-label="Flight Hours Per Year"
                      value={inputs.flightHoursPerYear}
                      onChange={(e) =>
                        updateInput(
                          'flightHoursPerYear',
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-full p-3 pl-6 text-black font-black text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-sm">
                      hours
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'energy' && (
              <>
                <div>
                  <label
                    htmlFor="input-grid"
                    className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm"
                  >
                    Indian Power Grid Zone
                  </label>
                  <select
                    id="input-grid"
                    aria-label="Indian Power Grid Zone"
                    value={inputs.indianZone}
                    onChange={(e) =>
                      updateInput('indianZone', e.target.value as UserInputs['indianZone'])
                    }
                    className="w-full bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-full p-3 pl-6 text-black font-black text-lg shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all cursor-pointer appearance-none"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23000000'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1.5rem center',
                      backgroundSize: '1.2em 1.2em',
                    }}
                  >
                    <option value="national-average">National Average</option>
                    <option value="northern">Northern Grid</option>
                    <option value="southern">Southern Grid</option>
                    <option value="western">Western Grid</option>
                    <option value="eastern">Eastern Grid</option>
                    <option value="north-eastern">North-Eastern Grid</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="input-electricity"
                      className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm"
                    >
                      Electricity
                    </label>
                    <div className="relative">
                      <input
                        id="input-electricity"
                        type="number"
                        min="0"
                        step="50"
                        aria-label="Electricity in kWh per month"
                        value={inputs.electricityKWhPerMonth}
                        onChange={(e) =>
                          updateInput(
                            'electricityKWhPerMonth',
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        className="w-full bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-full p-3 pl-6 text-black font-black text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-sm">
                        kWh/m
                      </span>
                    </div>
                  </div>
                  <div>
                    <label
                      htmlFor="input-lpg"
                      className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm"
                    >
                      LPG Cylinders
                    </label>
                    <div className="relative">
                      <input
                        id="input-lpg"
                        type="number"
                        min="0"
                        step="1"
                        aria-label="LPG Cylinders Per Year"
                        value={inputs.lpgCylindersPerYear}
                        onChange={(e) =>
                          updateInput(
                            'lpgCylindersPerYear',
                            e.target.value === '' ? '' : Number(e.target.value)
                          )
                        }
                        className="w-full bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-full p-3 pl-6 text-black font-black text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-sm">
                        / year
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="input-gas"
                    className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm"
                  >
                    Piped Natural Gas (Optional)
                  </label>
                  <div className="relative">
                    <input
                      id="input-gas"
                      type="number"
                      min="0"
                      step="5"
                      aria-label="Piped Natural Gas in therms per month"
                      value={inputs.naturalGasThermsPerMonth}
                      onChange={(e) =>
                        updateInput(
                          'naturalGasThermsPerMonth',
                          e.target.value === '' ? '' : Number(e.target.value)
                        )
                      }
                      className="w-full bg-white/60 backdrop-blur-md border-2 border-white/80 rounded-full p-3 pl-6 text-black font-black text-xl shadow-[inset_0_2px_10px_rgba(0,0,0,0.05)] outline-none focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/20 transition-all"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-800 font-bold text-sm">
                      therms/m
                    </span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'diet' && (
              <>
                <div>
                  <label className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm">
                    Diet Type
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {['meatHeavy', 'average', 'vegetarian', 'vegan'].map((type) => (
                      <button
                        key={type}
                        aria-pressed={inputs.dietType === type}
                        aria-label={`Select diet type: ${type}`}
                        onClick={() => updateInput('dietType', type as UserInputs['dietType'])}
                        className={`p-4 font-black text-lg capitalize transition-all text-center rounded-full border-2 ${
                          inputs.dietType === type
                            ? 'border-emerald-600 text-emerald-950 bg-white/80 shadow-md transform scale-[1.02]'
                            : 'border-white/50 text-slate-800 bg-white/40 hover:bg-white/60 hover:text-black hover:border-emerald-500'
                        }`}
                      >
                        {type.replace('Heavy', ' Heavy')}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'waste' && (
              <>
                <div>
                  <label className="block text-xs font-black text-black mb-2 uppercase tracking-widest drop-shadow-sm">
                    Recycling Level
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {['low', 'average', 'high'].map((type) => (
                      <button
                        key={type}
                        aria-pressed={inputs.recyclingLevel === type}
                        aria-label={`Select recycling level: ${type}`}
                        onClick={() =>
                          updateInput('recyclingLevel', type as UserInputs['recyclingLevel'])
                        }
                        className={`p-4 font-black text-lg capitalize transition-all text-center rounded-full border-2 ${
                          inputs.recyclingLevel === type
                            ? 'border-emerald-600 text-emerald-950 bg-white/80 shadow-md transform scale-[1.02]'
                            : 'border-white/50 text-slate-800 bg-white/40 hover:bg-white/60 hover:text-black hover:border-emerald-500'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

export default Calculator3D;
