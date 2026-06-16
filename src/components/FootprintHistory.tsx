'use client';

import { useEffect, useState } from 'react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { format } from 'date-fns';
import { getFootprintHistory, FootprintRecord } from '@/lib/firebase/firestore';
import { useAuth } from '@/lib/firebase/authContext';
import { Leaf } from 'lucide-react';

export function FootprintHistory() {
  const [history, setHistory] = useState<FootprintRecord[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchHistory = () => {
      if (user) {
        getFootprintHistory(user.uid)
          .then((data) => {
            setHistory(data.reverse()); // Reverse to show oldest first on the chart
          })
          .catch((e) => {
            console.error('Error fetching footprint history', e);
            setHistory([]);
          });
      } else {
        setHistory([]);
      }
    };

    fetchHistory();

    const handleUpdate = () => fetchHistory();
    window.addEventListener('ecosystem_history_updated', handleUpdate);
    return () => window.removeEventListener('ecosystem_history_updated', handleUpdate);
  }, [user]);

  if (!isClient) return null;

  if (history.length === 0) {
    return (
      <div className="w-full h-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center">
        <Leaf className="w-12 h-12 text-emerald-400 mb-4 opacity-50" />
        <h3 className="text-white font-bold text-xl mb-2">No Tracking History Yet</h3>
        <p className="text-emerald-100/70 text-sm max-w-sm">
          {user
            ? 'Calculate your footprint on the home page and save it to see your progress!'
            : 'Sign in and save footprints to see your progress over time!'}
        </p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = history.map((entry) => ({
    date: format(new Date(entry.date), 'MMM d'),
    score: entry.result.ecoScore,
    emissions: Number(entry.result.totalCO2eTons.toFixed(2)),
  }));

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10" />

      <h3 className="text-2xl font-black text-white mb-6 drop-shadow-sm flex items-center gap-2">
        <Leaf className="text-emerald-400" /> Score Progression
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={12} tickMargin={10} />
            <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(2, 44, 34, 0.9)',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '1rem',
                color: 'white',
                fontWeight: 'bold',
              }}
              itemStyle={{ color: '#34d399' }}
            />
            <Area
              type="monotone"
              dataKey="score"
              name="Eco Score"
              stroke="#34d399"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorScore)"
              dot={{ r: 4, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: '#34d399', stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <table className="sr-only" aria-label="Eco Score Progression Data">
        <thead>
          <tr>
            <th>Date</th>
            <th>Eco Score</th>
            <th>Emissions (Tons)</th>
          </tr>
        </thead>
        <tbody>
          {chartData.map((d, i) => (
            <tr key={i}>
              <td>{d.date}</td>
              <td>{d.score}</td>
              <td>{d.emissions}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
