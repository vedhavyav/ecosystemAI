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
import type { LocalizedEnvironmentalData } from '@/services/GoogleEarthEngineService';

export function FootprintHistory() {
  const [history, setHistory] = useState<FootprintRecord[]>([]);
  const [isClient] = useState(() => typeof window !== 'undefined');
  const { user } = useAuth();

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

  if (chartData.length === 1) {
    const firstEntry = history[0];
    const pastDate = new Date(firstEntry.date);
    pastDate.setDate(pastDate.getDate() - 7); // 1 week ago baseline

    chartData.unshift({
      date: format(pastDate, 'MMM d'),
      score: 50, // National Baseline
      emissions: Number((firstEntry.result.totalCO2eTons * 1.2).toFixed(2)), // Mock slightly higher emissions
    });
  }

  const handleExportCSV = () => {
    if (history.length === 0) return;

    // Build CSV Headers
    const headers = [
      'Date',
      'Eco Score',
      'Total CO2e (Tons)',
      'Transport CO2e',
      'Home Energy CO2e',
      'Diet CO2e',
      'Waste CO2e',
      'Local AQI',
      'Local Grid Factor',
      'Nearby EV Stations',
      'Nearby Plant-Based Spots',
    ];

    // Build CSV Rows mapping LocalData fields if available
    const rows = history.map((entry) => {
      const d = new Date(entry.date).toLocaleDateString();
      const score = entry.result.ecoScore;
      const tons = entry.result.totalCO2eTons.toFixed(2);
      const cat = entry.result.categories;
      const loc = (entry.result.localData || {}) as Partial<LocalizedEnvironmentalData>;

      return [
        d,
        score,
        tons,
        cat.transportation.toFixed(2),
        cat.homeEnergy.toFixed(2),
        cat.diet.toFixed(2),
        cat.waste.toFixed(2),
        loc.regionalAirQualityIndex || 'N/A',
        loc.dynamicGridFactor || 'N/A',
        loc.evChargingStationsNearby || 'N/A',
        loc.plantBasedRestaurantsNearby || 'N/A',
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `ecosystem_history_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
        <h3 className="text-2xl font-black text-white drop-shadow-sm flex items-center gap-2">
          <Leaf className="text-emerald-400" /> Score Progression
        </h3>
        <button
          onClick={handleExportCSV}
          className="mt-4 sm:mt-0 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full text-white font-medium text-sm transition-colors flex items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-download"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          Export CSV Data
        </button>
      </div>

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
