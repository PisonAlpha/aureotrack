'use client';

import { useState, useEffect } from 'react';

const SYMBOLS = ['BTC', 'ETH', 'BNB', 'SOL', 'XRP', 'DOGE'];

export default function Exchanges() {
  const [selectedSymbol, setSelectedSymbol] = useState('BTC');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchArbitrage(selectedSymbol);
    const interval = setInterval(() => fetchArbitrage(selectedSymbol), 30000);
    return () => clearInterval(interval);
  }, [selectedSymbol]);

  const fetchArbitrage = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/exchanges/arbitrage?symbol=' + symbol);
      const result = await res.json();
      if (!res.ok) throw new Error(result.error);
      setData(result);
    } catch (err: any) {
      setError(err.message);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Exchange Intelligence Center</h1>
          <p className="text-gray-500 text-sm mt-1">Real-time arbitrage spread comparison across major exchanges</p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {SYMBOLS.map(symbol => (
            <button
              key={symbol}
              onClick={() => setSelectedSymbol(symbol)}
              className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (
                selectedSymbol === symbol ? 'bg-black text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {symbol}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Fetching exchange prices...</p>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-semibold text-gray-900">{data.symbol}/USDT Spread</h2>
                <span className={"px-3 py-1.5 rounded-full text-sm font-medium " + (
                  data.spreadPercent > 0.5 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                )}>
                  {data.spreadPercent.toFixed(3)}% spread
                </span>
              </div>
              <p className="text-sm text-gray-400">
                Lowest on {data.lowest.exchange} (${data.lowest.price.toLocaleString()}) · Highest on {data.highest.exchange} (${data.highest.price.toLocaleString()})
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left text-xs font-medium text-gray-500 px-6 py-3">Exchange</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">Price (USDT)</th>
                    <th className="text-right text-xs font-medium text-gray-500 px-6 py-3">vs Lowest</th>
                  </tr>
                </thead>
                <tbody>
                  {data.prices.map((p: any, i: number) => (
                    <tr key={i} className="border-b border-gray-100 last:border-0">
                      <td className="px-6 py-4 font-medium text-gray-900">{p.exchange}</td>
                      <td className="px-6 py-4 text-right text-gray-900">${p.price.toLocaleString(undefined, { maximumFractionDigits: 4 })}</td>
                      <td className="px-6 py-4 text-right">
                        {p.exchange === data.lowest.exchange ? (
                          <span className="text-green-600 text-sm font-medium">Lowest</span>
                        ) : (
                          <span className="text-gray-500 text-sm">+{(((p.price - data.lowest.price) / data.lowest.price) * 100).toFixed(3)}%</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}
      </div>
    </main>
  );
}