'use client';

import { useState, useEffect } from 'react';

interface AssetPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
}

export default function Home() {
  const [assets, setAssets] = useState<AssetPrice[]>([]);
  const [riskSentiment, setRiskSentiment] = useState<{ score: number; label: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchMacroData();
    const interval = setInterval(fetchMacroData, 60000);
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aureotrack_user');
    setUser(null);
  };

  const fetchMacroData = async () => {
    try {
      const res = await fetch('/api/macro');
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets);
        setRiskSentiment(data.riskSentiment);
      }
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  const formatChange = (change: number) => {
    const sign = change >= 0 ? '+' : '';
    return sign + change.toFixed(2) + '%';
  };

  const getSentimentColor = (label: string) => {
    if (label === 'Risk On') return 'text-green-600 bg-green-50 border-green-200';
    if (label === 'Risk Off') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <button className="text-sm text-gray-900 font-medium bg-transparent border-0 cursor-pointer">Macro</button>
            <button onClick={() => window.location.href = '/crypto'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Crypto</button>
            <button onClick={() => window.location.href = '/trade'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Trade</button>
            <button onClick={() => window.location.href = '/ai'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">AI Insights</button>
            <button onClick={() => window.location.href = '/portfolio'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Portfolio</button>
            <button onClick={() => window.location.href = '/exchanges'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Exchanges</button>
            <button onClick={() => window.location.href = '/leaderboard'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Leaderboard</button>
            <button onClick={() => window.location.href = '/challenges'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Challenges</button>
            <button onClick={() => window.location.href = '/academy'} className="text-sm text-gray-500 hover:text-gray-900 bg-transparent border-0 cursor-pointer">Learn</button>
          </nav>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600 hidden sm:block">{user.full_name}</span>
              <button onClick={handleLogout} className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => window.location.href = '/login'} className="text-sm text-gray-600 hover:text-gray-900 bg-transparent border-0 cursor-pointer">
                Login
              </button>
              <button onClick={() => window.location.href = '/register'} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                Sign up free
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Macro Intelligence Hub</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time global market overview</p>
        </div>

        {riskSentiment && (
          <div className={"inline-flex items-center gap-3 px-5 py-3 rounded-xl border mb-8 " + getSentimentColor(riskSentiment.label)}>
            <span className="font-semibold">{riskSentiment.label}</span>
            <span className="text-sm opacity-75">Risk Score: {riskSentiment.score}/100</span>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading market data...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {assets.map(asset => (
              <div key={asset.id} className="bg-white border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-900">{asset.symbol}</span>
                  <span className="text-xs text-gray-400">{asset.name}</span>
                </div>
                <p className="text-2xl font-bold text-gray-900 mb-2">{formatPrice(asset.current_price)}</p>
                <div className="flex items-center gap-3 text-sm">
                  <span className={asset.price_change_percentage_24h >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                    {formatChange(asset.price_change_percentage_24h)}
                  </span>
                  <span className="text-gray-400">24h</span>
                </div>
                {asset.price_change_percentage_7d_in_currency !== undefined && (
                  <div className="flex items-center gap-3 text-sm mt-1">
                    <span className={asset.price_change_percentage_7d_in_currency >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatChange(asset.price_change_percentage_7d_in_currency)}
                    </span>
                    <span className="text-gray-400">7d</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white border border-gray-200 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">More features coming soon</h2>
          <p className="text-gray-500 text-sm">Crypto Intelligence, Demo Trading Terminal, AI Analysis, Portfolio Tracking, and more.</p>
        </div>
      </div>
    </main>
  );
}