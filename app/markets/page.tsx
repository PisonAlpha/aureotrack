'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const TABS = ['All', 'Crypto', 'Forex', 'Commodity'];

export default function Markets() {
  const [assets, setAssets] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [tab, setTab] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [marketStats, setMarketStats] = useState<any>(null);
  const [riskSentiment, setRiskSentiment] = useState<any>(null);
  const [sortBy, setSortBy] = useState('market_cap');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchAssets();
    const interval = setInterval(fetchAssets, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let list = [...assets];
    if (tab !== 'All') list = list.filter(a => a.type === tab.toLowerCase());
    if (search) list = list.filter(a =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.symbol?.toLowerCase().includes(search.toLowerCase())
    );
    list.sort((a, b) => {
      const av = a[sortBy] || 0;
      const bv = b[sortBy] || 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });
    setFiltered(list);
  }, [assets, tab, search, sortBy, sortDir]);

  const fetchAssets = async () => {
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

  const formatPrice = (price: number, type?: string) => {
    if (!price && price !== 0) return '—';
    if (type === 'forex') return price.toFixed(4);
    if (price >= 1000) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (price >= 1) return '$' + price.toFixed(2);
    if (price >= 0.001) return '$' + price.toFixed(6);
    return '$' + price.toFixed(8);
  };

  const formatChange = (change: number) => {
    if (!change && change !== 0) return '—';
    return (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
  };

  const formatLarge = (num: number) => {
    if (!num) return '—';
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + num.toLocaleString();
  };

  const handleSort = (field: string) => {
    if (sortBy === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortBy(field); setSortDir('desc'); }
  };

  const sentimentColor = riskSentiment?.score >= 65 ? '#10b981' : riskSentiment?.score <= 35 ? '#ef4444' : '#f59e0b';

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' }}>
      <Nav active="Intelligence" />

      {/* Header */}
      <div className="border-b border-white/10 py-10 px-4" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Live Market Data</p>
              <h1 className="text-3xl font-black text-white">Market Overview</h1>
              <p className="text-gray-500 text-sm mt-1">Real-time prices across crypto, forex, and commodities</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-gray-500">Live · Updates every 30s</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Market Cap', value: formatLarge(marketStats?.totalMarketCap), color: '#f59e0b' },
              { label: '24h Volume', value: formatLarge(marketStats?.totalVolume), color: '#3b82f6' },
              { label: 'Gainers', value: marketStats?.gainers || '—', color: '#10b981' },
              { label: 'Market Sentiment', value: riskSentiment?.label || '—', color: sentimentColor },
            ].map(stat => (
              <div key={stat.label} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-lg font-black" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                style={tab === t
                  ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
                {t}
                <span className="ml-1.5 text-xs opacity-60">
                  {t === 'All' ? assets.length : assets.filter(a => a.type === t.toLowerCase()).length}
                </span>
              </button>
            ))}
          </div>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name or symbol..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white bg-transparent border-0 cursor-pointer">✕</button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider w-8">#</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Asset</th>
                  <th className="text-left px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('current_price')}>
                    Price {sortBy === 'current_price' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white" onClick={() => handleSort('price_change_percentage_24h')}>
                    24h {sortBy === 'price_change_percentage_24h' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-white hidden sm:table-cell" onClick={() => handleSort('market_cap')}>
                    Market Cap {sortBy === 'market_cap' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="text-right px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell cursor-pointer hover:text-white" onClick={() => handleSort('total_volume')}>
                    Volume {sortBy === 'total_volume' ? (sortDir === 'desc' ? '↓' : '↑') : ''}
                  </th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    24h Range
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array(10).fill(0).map((_, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      {Array(8).fill(0).map((_, j) => (
                        <td key={j} className="px-4 py-4">
                          <div className="h-4 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-16 text-gray-600">No assets found</td>
                  </tr>
                ) : (
                  filtered.map((asset, i) => {
                    const change = asset.price_change_percentage_24h || 0;
                    const isPositive = change >= 0;
                    const typeColor = asset.type === 'crypto' ? '#3b82f6' : asset.type === 'forex' ? '#8b5cf6' : '#f59e0b';
                    const rangePercent = asset.high_24h && asset.low_24h && asset.current_price
                      ? ((asset.current_price - asset.low_24h) / (asset.high_24h - asset.low_24h)) * 100
                      : 50;
                    return (
                      <tr key={asset.id}
                        className="hover:bg-white/5 transition-colors cursor-pointer"
                        style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                        onClick={() => asset.type === 'crypto' && (window.location.href = '/trade')}>
                        <td className="px-6 py-4 text-xs text-gray-600">{i + 1}</td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: `${typeColor}18`, color: typeColor }}>
                              {asset.symbol?.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-white">{asset.name}</p>
                              <p className="text-xs text-gray-500">{asset.symbol}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-2 py-0.5 rounded-full text-xs font-medium capitalize" style={{ background: `${typeColor}15`, color: typeColor, border: `1px solid ${typeColor}25` }}>
                            {asset.type}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <p className="text-sm font-semibold text-white">{formatPrice(asset.current_price, asset.type)}</p>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <span className={"text-sm font-semibold px-2 py-0.5 rounded-lg " + (isPositive ? 'text-green-400' : 'text-red-400')} style={{ background: isPositive ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)' }}>
                            {formatChange(change)}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-right hidden sm:table-cell">
                          <p className="text-sm text-gray-400">{formatLarge(asset.market_cap)}</p>
                        </td>
                        <td className="px-4 py-4 text-right hidden md:table-cell">
                          <p className="text-sm text-gray-400">{formatLarge(asset.total_volume)}</p>
                        </td>
                        <td className="px-6 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{formatPrice(asset.low_24h, asset.type)}</span>
                            <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)', minWidth: '60px' }}>
                              <div className="h-full rounded-full" style={{ width: `${Math.min(100, Math.max(0, rangePercent))}%`, background: 'linear-gradient(90deg, #f59e0b, #10b981)' }} />
                            </div>
                            <span className="text-xs text-gray-600">{formatPrice(asset.high_24h, asset.type)}</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between">
              <p className="text-xs text-gray-600">Showing {filtered.length} assets</p>
              <p className="text-xs text-gray-600">Click any crypto asset to trade →</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}