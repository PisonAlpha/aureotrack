'use client';

import { useState, useEffect } from 'react';

export default function Leaderboard() {
  const [topReturns, setTopReturns] = useState<any[]>([]);
  const [topWinRates, setTopWinRates] = useState<any[]>([]);
  const [tab, setTab] = useState<'returns' | 'winrate'>('returns');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch('/api/leaderboard');
      const data = await res.json();
      if (data.success) {
        setTopReturns(data.topReturns);
        setTopWinRates(data.topWinRates);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const list = tab === 'returns' ? topReturns : topWinRates;

  const getMedal = (rank: number) => {
    if (rank === 0) return '🥇';
    if (rank === 1) return '🥈';
    if (rank === 2) return '🥉';
    return '#' + (rank + 1);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Leaderboards</h1>
          <p className="text-gray-500 text-sm mt-1">Top performing demo traders on AureoTrack</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab('returns')}
            className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (tab === 'returns' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600')}
          >
            Best Total Return
          </button>
          <button
            onClick={() => setTab('winrate')}
            className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (tab === 'winrate' ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600')}
          >
            Highest Win Rate
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <p className="text-gray-400">No ranked traders yet. Start trading to appear on the leaderboard!</p>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            {list.map((trader, i) => (
              <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-400 w-8 text-center">{getMedal(i)}</span>
                  <div>
                    <p className="font-medium text-gray-900">{trader.name}</p>
                    <p className="text-xs text-gray-400">{trader.totalTrades} trades</p>
                  </div>
                </div>
                <div className="text-right">
                  {tab === 'returns' ? (
                    <p className={"font-bold " + (trader.returnPercent >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {trader.returnPercent >= 0 ? '+' : ''}{trader.returnPercent.toFixed(2)}%
                    </p>
                  ) : (
                    <p className="font-bold text-gray-900">{trader.winRate.toFixed(1)}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}