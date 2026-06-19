'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

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
    } catch {} finally {
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
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoCommunity" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Leaderboard</h1>
          <p className="text-gray-500 text-sm">Top performing demo traders on AureoTrack</p>
        </div>

        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab('returns')} className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (tab === 'returns' ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white')}>
            Best Total Return
          </button>
          <button onClick={() => setTab('winrate')} className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (tab === 'winrate' ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white')}>
            Highest Win Rate
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : list.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-500 text-sm">No ranked traders yet. Start trading to appear here!</p>
            <button onClick={() => window.location.href = '/trade'} className="mt-4 px-6 py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Start Trading
            </button>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 grid grid-cols-3 text-xs text-gray-500 font-medium">
              <span>Rank & Trader</span>
              <span className="text-center">Trades</span>
              <span className="text-right">{tab === 'returns' ? 'Total Return' : 'Win Rate'}</span>
            </div>
            {list.map((trader, i) => (
              <div key={i} className={"flex items-center justify-between px-6 py-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors " + (i < 3 ? 'bg-yellow-500/5' : '')}>
                <div className="flex items-center gap-4 flex-1">
                  <span className="font-bold text-gray-400 w-8 text-center text-lg">{getMedal(i)}</span>
                  <div>
                    <p className="font-medium text-white">{trader.name}</p>
                    <p className="text-xs text-gray-500">Demo Trader</p>
                  </div>
                </div>
                <div className="text-center w-20">
                  <p className="text-sm text-gray-400">{trader.totalTrades}</p>
                </div>
                <div className="text-right w-24">
                  {tab === 'returns' ? (
                    <p className={"font-bold text-lg " + (trader.returnPercent >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {trader.returnPercent >= 0 ? '+' : ''}{trader.returnPercent.toFixed(2)}%
                    </p>
                  ) : (
                    <p className="font-bold text-lg text-yellow-400">{trader.winRate.toFixed(1)}%</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}