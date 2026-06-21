import { useState, useEffect } from 'react';
import type { UserInputs, FootprintResult, Recommendation } from '@/engine/types';

export function useFootprintCalculation(inputs: UserInputs) {
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/footprint', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(inputs),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch from API route');
        }

        const data = await response.json();

        if (active) {
          setResult(data.result);
          setRecommendations(data.recommendations);
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
