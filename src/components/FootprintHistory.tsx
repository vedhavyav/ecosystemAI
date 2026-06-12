"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area, AreaChart } from "recharts";
import { format } from "date-fns";
import { getFootprintHistory, TrackingEntry } from "@/engine/storage";
import { Leaf } from "lucide-react";

export function FootprintHistory() {
  const [history, setHistory] = useState<TrackingEntry[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Initial load
    setHistory(getFootprintHistory());

    // Listen for custom event to update immediately without refresh
    const handleStorageChange = () => setHistory(getFootprintHistory());
    window.addEventListener('ecosystem_history_updated', handleStorageChange);
    return () => window.removeEventListener('ecosystem_history_updated', handleStorageChange);
  }, []);

  if (!isClient) return null;

  if (history.length === 0) {
    return (
      <div className="w-full h-64 bg-white/10 backdrop-blur-md border border-white/20 rounded-[2rem] flex flex-col items-center justify-center p-6 text-center">
        <Leaf className="w-12 h-12 text-emerald-400 mb-4 opacity-50" />
        <h3 className="text-white font-bold text-xl mb-2">No Tracking History Yet</h3>
        <p className="text-emerald-100/70 text-sm max-w-sm">
          Use the calculator to log your footprint. Your history will appear here so you can track your progress over time!
        </p>
      </div>
    );
  }

  // Format data for Recharts
  const chartData = history.map(entry => ({
    date: format(new Date(entry.timestamp), "MMM d, h:mm a"),
    score: entry.result.ecoScore,
    emissions: Number(entry.result.totalCO2eTons.toFixed(2))
  }));

  return (
    <div className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl overflow-hidden relative">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px] -z-10" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -z-10" />

      <h3 className="text-2xl font-black text-white mb-6 drop-shadow-sm flex items-center gap-2">
        <Leaf className="text-emerald-400" /> Score Progression
      </h3>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#34d399" stopOpacity={0.5}/>
                <stop offset="95%" stopColor="#34d399" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12} 
              tickMargin={10}
              tickFormatter={(val) => val.split(',')[0]} // Show only date
            />
            <YAxis 
              stroke="rgba(255,255,255,0.5)" 
              fontSize={12} 
              domain={[0, 100]}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(2, 44, 34, 0.9)', 
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '1rem',
                color: 'white',
                fontWeight: 'bold'
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
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
