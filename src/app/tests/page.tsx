'use client';

import { useState, useEffect } from 'react';
import { calculateFootprint } from '@/engine/calculations';
import { Activity, CheckCircle2, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function TestingDashboard() {
  const [results, setResults] = useState<{ name: string; passed: boolean; message: string }[]>([]);

  useEffect(() => {
    let active = true;
    const runTests = async () => {
      const tests = [];

      try {
        // Test 1: Vegan Diet vs Meat Diet
        const veganFootprint = await calculateFootprint({
          kilometersDrivenPerWeek: 0,
          vehicleType: 'publicTransit',
          indianZone: 'national-average',
          flightHoursPerYear: 0,
          electricityKWhPerMonth: 0,
          lpgCylindersPerYear: 0,
          naturalGasThermsPerMonth: 0,
          dietType: 'vegan',
          recyclingLevel: 'average',
        });
        const meatFootprint = await calculateFootprint({
          kilometersDrivenPerWeek: 0,
          vehicleType: 'publicTransit',
          indianZone: 'national-average',
          flightHoursPerYear: 0,
          electricityKWhPerMonth: 0,
          lpgCylindersPerYear: 0,
          naturalGasThermsPerMonth: 0,
          dietType: 'meatHeavy',
          recyclingLevel: 'average',
        });

        if (veganFootprint.totalCO2eKg < meatFootprint.totalCO2eKg) {
          tests.push({
            name: 'Diet Calculation Check',
            passed: true,
            message: 'Vegan diet emits less than meat-heavy diet.',
          });
        } else {
          tests.push({
            name: 'Diet Calculation Check',
            passed: false,
            message: 'Math error in diet emissions.',
          });
        }

        // Test 2: Score Limits
        if (veganFootprint.ecoScore >= 0 && veganFootprint.ecoScore <= 100) {
          tests.push({
            name: 'Eco Score Bounds',
            passed: true,
            message: 'Score is strictly between 0 and 100.',
          });
        } else {
          tests.push({
            name: 'Eco Score Bounds',
            passed: false,
            message: `Score out of bounds: ${veganFootprint.ecoScore}`,
          });
        }

        // Test 3: EV vs Gas Transport
        const evFootprint = await calculateFootprint({
          kilometersDrivenPerWeek: 300,
          vehicleType: 'electric',
          indianZone: 'national-average',
          flightHoursPerYear: 0,
          electricityKWhPerMonth: 0,
          lpgCylindersPerYear: 0,
          naturalGasThermsPerMonth: 0,
          dietType: 'average',
          recyclingLevel: 'average',
        });
        const gasFootprint = await calculateFootprint({
          kilometersDrivenPerWeek: 300,
          vehicleType: 'petrol',
          indianZone: 'national-average',
          flightHoursPerYear: 0,
          electricityKWhPerMonth: 0,
          lpgCylindersPerYear: 0,
          naturalGasThermsPerMonth: 0,
          dietType: 'average',
          recyclingLevel: 'average',
        });

        if (evFootprint.totalCO2eKg < gasFootprint.totalCO2eKg) {
          tests.push({
            name: 'Transport Calculation Check',
            passed: true,
            message: 'EV emits less than gasoline over same distance.',
          });
        } else {
          tests.push({
            name: 'Transport Calculation Check',
            passed: false,
            message: 'EV emitted more or equal to gasoline.',
          });
        }
      } catch (e: unknown) {
        tests.push({
          name: 'Runtime Check',
          passed: false,
          message: e instanceof Error ? e.message : 'Unknown error',
        });
      }

      if (active) {
        setResults(tests);
      }
    };

    runTests();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="min-h-screen p-8 md:p-16 flex flex-col items-center">
      <div className="w-full max-w-3xl mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-4"
        >
          <div className="p-4 bg-white/30 backdrop-blur-sm rounded-2xl shadow-sm border border-emerald-500/20">
            <Activity className="w-8 h-8 text-emerald-800" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-emerald-950">System Health</h1>
            <p className="text-emerald-900/70 font-light">
              Internal engine validation & bounds checking
            </p>
          </div>
        </motion.div>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="p-8 text-center text-emerald-900 animate-pulse font-light">
              Running verification tests...
            </div>
          ) : (
            results.map((t, i) => (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                key={i}
                className={`p-6 flex items-start gap-4 border-l-4 ${
                  t.passed
                    ? 'bg-emerald-50/40 backdrop-blur-md border-emerald-500 shadow-sm'
                    : 'bg-red-50/40 backdrop-blur-md border-red-500 shadow-sm'
                }`}
              >
                <div className="mt-1">
                  {t.passed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-lg font-semibold ${t.passed ? 'text-emerald-950' : 'text-red-950'}`}
                  >
                    {t.name}
                  </h3>
                  <p className="text-emerald-900/70 mt-1 font-light">{t.message}</p>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
