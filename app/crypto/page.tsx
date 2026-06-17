'use client';

import { useState } from 'react';

export default function Crypto() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleScan = async () => {
    if (!query.trim()) {
      setError('Enter a token name, symbol, or contract address');
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const res = await fetch('/api/crypto/scan?query=' + encodeURIComponent(query.trim()));
      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      if (!data.found) {
        setResults([]);
        setError(data.message);
      } else {
        setResults(data.results);
      }
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 65) return 'text-green-600 bg-green-50 border-green-200';
    if (score >= 40) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getRiskLabel = (score: number) => {
    if (score >= 65) return 'Low Risk';
    if (score >= 40) return 'Medium Risk';
    return 'High Risk';
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3) return '$' + (num / 1e3).toFixed(2) + 'K';
    return '$' + num.toFixed(2);
  };

  const formatPrice = (price: string) => {
    const p = parseFloat(price);
    if (p < 0.0001) return '$' + p.toExponential(2);
    if (p < 1) return '$' + p.toFixed(6);
    return '$' + p.toLocaleString(undefined, { maximumFractionDigits: 2 });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Crypto Intelligence Hub</h1>
          <p className="text-gray-500 text-sm mt-1">Token scanner, liquidity analysis, and rug pull risk detection</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search by name, symbol, or contract address</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="e.g. PEPE, 0x6982..., shiba inu"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan Token'}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">{error}</div>
        )}

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Scanning token data...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((token, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-gray-900 text-lg">{token.tokenName}</h3>
                      <span className="text-gray-400 text-sm">{token.tokenSymbol}</span>
                    </div>
                    <p className="text-xs text-gray-400">{token.chainId.toUpperCase()} · {token.dexId}</p>
                  </div>
                  <span className={"px-3 py-1.5 rounded-full text-sm font-medium border " + getRiskColor(token.riskScore)}>
                    {getRiskLabel(token.riskScore)} · {token.riskScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Price</p>
                    <p className="font-semibold text-gray-900">{formatPrice(token.priceUsd)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">24h Change</p>
                    <p className={"font-semibold " + (token.priceChange24h >= 0 ? 'text-green-600' : 'text-red-600')}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Liquidity</p>
                    <p className="font-semibold text-gray-900">{formatNumber(token.liquidityUsd)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">24h Volume</p>
                    <p className="font-semibold text-gray-900">{formatNumber(token.volume24h)}</p>
                  </div>
                </div>

                {token.marketCap > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-400 mb-1">Market Cap / FDV</p>
                    <p className="font-semibold text-gray-900">{formatNumber(token.marketCap)}</p>
                  </div>
                )}

                {token.riskFactors.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-700 mb-2">Risk Factors</p>
                    <ul className="space-y-1">
                      {token.riskFactors.map((factor: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                          <span className="text-gray-400">•</span> {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="font-mono text-xs text-gray-400 mt-3 break-all">{token.tokenAddress}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-20 bg-white border border-gray-200 rounded-2xl">
            <p className="text-gray-400">No results found</p>
          </div>
        )}
      </div>
    </main>
  );
}