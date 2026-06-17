import { useState, useEffect } from 'react';
import type { UserInputs, FootprintResult } from '@/engine/calculations';
import { calculateFootprint } from '@/engine/calculations';
import { generateRecommendations, Recommendation } from '@/engine/recommendations';

export function useFootprintCalculation(inputs: UserInputs) {
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await calculateFootprint(inputs);
        if (active) {
          setResult(res);
          setRecommendations(generateRecommendations(inputs, res));
        }
      } catch (error) {
        console.error('Calculation failed:', error);
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchData();
    return () => {
      active = false;
    };
  }, [inputs]);

  return { result, recommendations, loading };
}
