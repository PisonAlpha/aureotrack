'use client';

import { useState } from 'react';
import Nav from '../components/Nav';

export default function Crypto() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [searched, setSearched] = useState(false);

  const handleScan = async () => {
    if (!query.trim()) { setError('Enter a token name, symbol, or contract address'); return; }
    setLoading(true);
    setError(null);
    setSearched(true);
    try {
      const res = await fetch('/api/crypto/scan?query=' + encodeURIComponent(query.trim()));
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (!data.found) { setResults([]); setError(data.message); }
      else setResults(data.results);
    } catch (err: any) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 65) return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (score >= 40) return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
    return 'text-red-400 bg-red-400/10 border-red-400/20';
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

  const POPULAR = ['PEPE', 'SHIB', 'DOGE', 'FLOKI', 'WIF', 'BONK', 'ARB', 'OP', 'MATIC'];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="Intelligence" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Crypto Intelligence Hub</h1>
          <p className="text-gray-500 text-sm">Token scanner, liquidity analysis, and rug pull risk detection</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <label className="block text-sm font-medium text-gray-400 mb-2">Search by name, symbol, or contract address</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan()}
              placeholder="e.g. PEPE, 0x6982508145454ce325ddbe47a25d4ec3d2311933"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
            />
            <button
              onClick={handleScan}
              disabled={loading}
              className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loading ? 'Scanning...' : 'Scan Token'}
            </button>
          </div>
          <div className="flex gap-2 mt-3 flex-wrap">
            {POPULAR.map(t => (
              <button key={t} onClick={() => { setQuery(t); }} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                {t}
              </button>
            ))}
          </div>
        </div>

        {error && <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>}

        {loading && (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Scanning token data across DEXes...</p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <div className="space-y-4">
            {results.map((token, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-colors">
                <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-white text-lg">{token.tokenName}</h3>
                      <span className="text-gray-500 text-sm">{token.tokenSymbol}</span>
                    </div>
                    <p className="text-xs text-gray-600">{token.chainId.toUpperCase()} · {token.dexId}</p>
                  </div>
                  <span className={"px-3 py-1.5 rounded-full text-sm font-medium border " + getRiskColor(token.riskScore)}>
                    {getRiskLabel(token.riskScore)} · {token.riskScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Price</p>
                    <p className="font-semibold text-white">{formatPrice(token.priceUsd)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">24h Change</p>
                    <p className={"font-semibold " + (token.priceChange24h >= 0 ? 'text-green-400' : 'text-red-400')}>
                      {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(2)}%
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Liquidity</p>
                    <p className="font-semibold text-white">{formatNumber(token.liquidityUsd)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">24h Volume</p>
                    <p className="font-semibold text-white">{formatNumber(token.volume24h)}</p>
                  </div>
                </div>

                {token.marketCap > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Market Cap / FDV</p>
                    <p className="font-semibold text-white">{formatNumber(token.marketCap)}</p>
                  </div>
                )}

                {token.riskFactors.length > 0 && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs font-medium text-gray-400 mb-2">Risk Factors</p>
                    <ul className="space-y-1">
                      {token.riskFactors.map((factor: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-400 flex items-start gap-2">
                          <span className="text-yellow-500">•</span> {factor}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <p className="font-mono text-xs text-gray-600 mt-3 break-all">{token.tokenAddress}</p>
              </div>
            ))}
          </div>
        )}

        {!loading && searched && results.length === 0 && !error && (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-500">No results found. Try a different token name or contract address.</p>
          </div>
        )}
      </div>
    </div>
  );
}