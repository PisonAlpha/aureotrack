'use client';

import { useState, useEffect } from 'react';
import Nav from './components/Nav';


interface Asset {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap: number;
  total_volume: number;
  type: string;
}



export default function Home() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [marketStats, setMarketStats] = useState<any>(null);
  const [riskSentiment, setRiskSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sortBy, setSortBy] = useState<'market_cap' | 'price_change_percentage_24h' | 'total_volume'>('market_cap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [filter, setFilter] = useState<'all' | 'crypto' | 'commodity' | 'forex'>('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    fetchMacroData();
    const interval = setInterval(fetchMacroData, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchMacroData = async () => {
    try {
      const res = await fetch('/api/macro');
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets);
        setMarketStats(data.marketStats);
        setRiskSentiment(data.riskSentiment);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSort = (col: typeof sortBy) => {
    if (sortBy === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortDir('desc'); }
  };

 

  const filtered = assets
    .filter(a => filter === 'all' || a.type === filter)
    .filter(a => !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.symbol.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const aVal = a[sortBy] || 0;
      const bVal = b[sortBy] || 0;
      return sortDir === 'desc' ? bVal - aVal : aVal - bVal;
    });

  const formatPrice = (price: number, type?: string) => {
    if (!price) return '$0';
    if (type === 'forex') return price.toFixed(4);
    if (price >= 1000) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (price >= 1) return '$' + price.toFixed(2);
    return '$' + price.toFixed(6);
  };

  const formatLarge = (num: number) => {
    if (!num) return '—';
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + num.toLocaleString();
  };

  const formatChange = (change: number) => {
    if (change === undefined || change === null) return '—';
    return (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
  };

  const getSentimentColor = (label: string) => {
    if (label === 'Risk On') return 'text-green-400 bg-green-400/10 border-green-400/30';
    if (label === 'Risk Off') return 'text-red-400 bg-red-400/10 border-red-400/30';
    return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="Intelligence" />

      <div className="border-b border-white/10 bg-[#111111]">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center gap-6 overflow-x-auto text-xs text-gray-400 whitespace-nowrap">
          {marketStats && (
            <>
              <span>Market Cap: <span className="text-white font-medium">{formatLarge(marketStats.totalMarketCap)}</span></span>
              <span className="text-white/20">|</span>
              <span>24h Volume: <span className="text-white font-medium">{formatLarge(marketStats.totalVolume)}</span></span>
              <span className="text-white/20">|</span>
              <span>Gainers: <span className="text-green-400 font-medium">{marketStats.gainers}</span></span>
              <span className="text-white/20">|</span>
              <span>Losers: <span className="text-red-400 font-medium">{marketStats.losers}</span></span>
              {riskSentiment && (
                <>
                  <span className="text-white/20">|</span>
                  <span className={"px-2 py-0.5 rounded-full border text-xs font-medium " + getSentimentColor(riskSentiment.label)}>
                    {riskSentiment.label} · {riskSentiment.score}/100
                  </span>
                </>
              )}
            </>
          )}
          <span className="ml-auto text-gray-600">Updates every 60s</span>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Market Overview</h1>
          <p className="text-gray-500 text-sm">Real-time prices across crypto and commodities</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search assets..."
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-white/30"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'crypto', 'commodity', 'forex'] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors capitalize " + (filter === f ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')}>
                {f}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Loading market data...</p>
          </div>
        ) : (
          <div className="bg-[#111111] border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[320px]">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 w-8">#</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Name</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Price</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-white" onClick={() => handleSort('price_change_percentage_24h')}>
                      24h {sortBy === 'price_change_percentage_24h' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">7d</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-white hidden md:table-cell" onClick={() => handleSort('market_cap')}>
                      Market Cap {sortBy === 'market_cap' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 cursor-pointer hover:text-white hidden lg:table-cell" onClick={() => handleSort('total_volume')}>
                      Volume (24h) {sortBy === 'total_volume' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                    </th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Type</th>
                    <th className="text-right px-4 py-3 text-xs font-medium text-gray-500">Trade</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((asset, i) => (
                    <tr key={asset.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-4 py-4 text-gray-600 text-sm">{i + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-white">{asset.symbol.slice(0, 2)}</span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-white truncate max-w-[100px] sm:max-w-none">{asset.name}</p>
                            <p className="text-xs text-gray-500">{asset.symbol}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-medium text-white">{formatPrice(asset.current_price, asset.type)}</span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className={"text-sm font-medium " + (asset.price_change_percentage_24h >= 0 ? 'text-green-400' : 'text-red-400')}>
                          {formatChange(asset.price_change_percentage_24h)}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right hidden sm:table-cell">
                        <span className={"text-sm " + ((asset.price_change_percentage_7d_in_currency || 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                          {asset.price_change_percentage_7d_in_currency !== undefined ? formatChange(asset.price_change_percentage_7d_in_currency) : '—'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className="text-sm text-gray-300">{formatLarge(asset.market_cap)}</span>
                      </td>
                      <td className="px-4 py-4 text-right hidden lg:table-cell">
                        <span className="text-sm text-gray-300">{formatLarge(asset.total_volume)}</span>
                      </td>
                      <td className="px-4 py-4 text-right hidden md:table-cell">
                        <span className={"text-xs px-2 py-0.5 rounded-full " + (asset.type === 'crypto' ? 'bg-blue-400/10 text-blue-400' : 'bg-yellow-400/10 text-yellow-400')}>
                          {asset.type}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button onClick={() => window.location.href = '/trade'} className="px-3 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-xs font-medium hover:bg-yellow-500/20 transition-colors border border-yellow-500/20">
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { title: 'Demo Trading Terminal', desc: 'Trade BTC, ETH, Gold and more with $100,000 in virtual funds', href: '/trade', icon: '📈', color: 'border-blue-500/20 hover:border-blue-500/40' },
            { title: 'AI Market Intelligence', desc: 'Get AI-powered analysis on any asset with probability forecasts', href: '/ai', icon: '🤖', color: 'border-purple-500/20 hover:border-purple-500/40' },
            { title: 'AureoAcademy', desc: 'Learn trading from beginner to professional with 60+ AI lessons', href: '/academy', icon: '🎓', color: 'border-yellow-500/20 hover:border-yellow-500/40' },
          ].map(card => (
            <button key={card.title} onClick={() => window.location.href = card.href} className={"text-left p-5 bg-white/5 border rounded-2xl hover:bg-white/8 transition-all cursor-pointer " + card.color}>
              <span className="text-2xl mb-3 block">{card.icon}</span>
              <h3 className="font-semibold text-white mb-1 text-sm">{card.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{card.desc}</p>
            </button>
          ))}
        </div>
      </div>

     <footer className="border-t border-white/10 mt-12 py-10 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
            <div className="flex items-center gap-2">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-7 h-7 rounded object-cover" />
              <div>
                <span className="text-sm font-bold text-white">AureoTrack</span>
                <p className="text-xs text-gray-600">Macro & Trading Intelligence</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <a href="https://x.com/aureotrack" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                @aureotrack
              </a>
              <a href="https://t.me/aureo_track" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.86l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.726z"/></svg>
                Telegram
              </a>
              <a href="https://www.facebook.com/share/1LX95LaMVj/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </a>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-gray-600">© 2025 AureoTrack. All rights reserved.</span>
            <div className="flex items-center gap-4 flex-wrap justify-center">
              {[['/', 'Markets'], ['/trade', 'AureoTrade'], ['/academy', 'AureoAcademy'], ['/ai', 'AureoAI'], ['/community', 'AureoCommunity'], ['/about', 'About'], ['/whitepaper', 'Whitepaper'], ['/airdrop', 'Airdrop']].map(([href, label]) => (
                <button key={label} onClick={() => window.location.href = href} className="text-xs text-gray-600 hover:text-gray-400 bg-transparent border-0 cursor-pointer">{label}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}