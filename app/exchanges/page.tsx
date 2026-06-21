'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const POPULAR = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE', 'ADA', 'TRX', 'AVAX', 'LINK', 'DOT', 'MATIC', 'UNI', 'PEPE', 'SHIB'];

export default function Exchanges() {
  const [symbol, setSymbol] = useState('BTC');
  const [search, setSearch] = useState('');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'all' | 'cex' | 'dex'>('all');
  const [availableSymbols, setAvailableSymbols] = useState<string[]>([]);

  useEffect(() => {
    fetchArbitrage(symbol);
    const interval = setInterval(() => fetchArbitrage(symbol), 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const fetchArbitrage = async (sym: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/exchanges/arbitrage?symbol=' + sym);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
      if (result.availableSymbols) setAvailableSymbols(result.availableSymbols);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setSymbol(search.trim().toUpperCase());
      setSearch('');
    }
  };

  const displayPrices = data ? (
    tab === 'cex' ? data.cexPrices :
    tab === 'dex' ? data.dexPrices :
    data.prices
  ) : [];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="Intelligence" />

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Exchange Intelligence Center</h1>
          <p className="text-gray-500 text-sm">Real-time arbitrage scanner across CEX and DEX — find the best prices instantly</p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search any token (e.g. BTC, PEPE, ARB)..."
            className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
          />
          <button type="submit" className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
            Search
          </button>
        </form>

        <div className="flex gap-2 mb-6 flex-wrap">
          {POPULAR.map(s => (
            <button key={s} onClick={() => setSymbol(s)} className={"px-3 py-1.5 rounded-xl text-xs font-medium transition-colors " + (symbol === s ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10')}>
              {s}
            </button>
          ))}
        </div>

        {error && <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Scanning exchanges for {symbol}...</p>
          </div>
        ) : data ? (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">Token</p>
                <p className="text-2xl font-bold text-yellow-400">{data.symbol}</p>
                <p className="text-xs text-gray-600 mt-1">{data.prices.length} sources found</p>
              </div>
              <div className="bg-white/5 border border-green-400/20 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">Lowest Price</p>
                <p className="text-xl font-bold text-green-400">${data.lowest.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
                <p className="text-xs text-gray-400 mt-1">{data.lowest.exchange}</p>
              </div>
              <div className="bg-white/5 border border-red-400/20 rounded-2xl p-5">
                <p className="text-xs text-gray-500 mb-1">Highest Price</p>
                <p className="text-xl font-bold text-red-400">${data.highest.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</p>
                <p className="text-xs text-gray-400 mt-1">{data.highest.exchange}</p>
              </div>
              <div className={"bg-white/5 rounded-2xl p-5 border " + (data.spreadPercent > 0.5 ? 'border-yellow-400/30' : 'border-white/10')}>
                <p className="text-xs text-gray-500 mb-1">Arbitrage Spread</p>
                <p className={"text-xl font-bold " + (data.spreadPercent > 0.5 ? 'text-yellow-400' : 'text-gray-300')}>{data.spreadPercent.toFixed(3)}%</p>
                <p className="text-xs text-gray-400 mt-1">${data.spreadAmount.toFixed(4)} difference</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h3 className="font-semibold text-white">{data.symbol}/USDT Price Comparison</h3>
                  <p className="text-xs text-gray-500 mt-0.5">Auto-refreshes every 30 seconds</p>
                </div>
                <div className="flex gap-2">
                  {(['all', 'cex', 'dex'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)} className={"px-3 py-1.5 rounded-lg text-xs font-medium uppercase transition-colors " + (tab === t ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')}>
                      {t === 'all' ? 'All' : t === 'cex' ? 'CEX Only' : 'DEX Only'}
                    </button>
                  ))}
                </div>
              </div>

              {displayPrices.length === 0 ? (
                <div className="text-center py-10 text-gray-500 text-sm">No {tab === 'dex' ? 'DEX' : 'CEX'} prices found for {symbol}</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead className="bg-white/5">
                      <tr>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Exchange</th>
                        <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Type</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">Price (USDT)</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">vs Lowest</th>
                        <th className="text-right px-6 py-3 text-xs font-medium text-gray-500">Signal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayPrices.map((p: any, i: number) => (
                        <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-6 py-4 font-medium text-white whitespace-nowrap">{p.exchange}</td>
                          <td className="px-6 py-4">
                            <span className={"text-xs px-2 py-0.5 rounded-full border " + (p.type === 'DEX' ? 'bg-purple-400/10 text-purple-400 border-purple-400/20' : 'bg-blue-400/10 text-blue-400 border-blue-400/20')}>
                              {p.type}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right text-white font-medium whitespace-nowrap">${p.price.toLocaleString(undefined, { maximumFractionDigits: 6 })}</td>
                          <td className="px-6 py-4 text-right whitespace-nowrap">
                            {p.exchange === data.lowest.exchange && p.type === data.lowest.type ? (
                              <span className="text-green-400 text-sm font-medium">Lowest ✓</span>
                            ) : (
                              <span className="text-gray-400 text-sm">+{(((p.price - data.lowest.price) / data.lowest.price) * 100).toFixed(3)}%</span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            {p.exchange === data.lowest.exchange ? (
                              <span className="px-2 py-1 bg-green-400/10 text-green-400 rounded-lg text-xs border border-green-400/20">Buy</span>
                            ) : p.exchange === data.highest.exchange ? (
                              <span className="px-2 py-1 bg-red-400/10 text-red-400 rounded-lg text-xs border border-red-400/20">Sell</span>
                            ) : (
                              <span className="text-gray-600 text-xs">—</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4">
              <p className="text-xs text-yellow-400 font-medium mb-1">Arbitrage Opportunity</p>
              <p className="text-xs text-gray-400">
                {data.spreadPercent > 0.5
                  ? `A ${data.spreadPercent.toFixed(3)}% spread exists between ${data.lowest.exchange} and ${data.highest.exchange}. Buy on ${data.lowest.exchange} at $${data.lowest.price.toLocaleString()} and sell on ${data.highest.exchange} at $${data.highest.price.toLocaleString()} for a potential profit of $${data.spreadAmount.toFixed(4)} per unit (before fees).`
                  : `The current spread of ${data.spreadPercent.toFixed(3)}% is relatively small. Arbitrage opportunities typically require spreads above 0.5% to be profitable after exchange fees.`
                }
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}