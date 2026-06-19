'use client';

import { useState } from 'react';
import Nav from '../components/Nav';

export default function Portfolio() {
  const [evmAddress, setEvmAddress] = useState('');
  const [solanaAddress, setSolanaAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const handleFetch = async () => {
    if (!evmAddress && !solanaAddress) {
      setError('Enter at least one wallet address');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/portfolio/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ evmAddress: evmAddress.trim() || null, solanaAddress: solanaAddress.trim() || null }),
      });
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

  const connectMetaMask = async () => {
    if (!(window as any).ethereum) {
      setError('MetaMask not detected. Please install it or enter your address manually.');
      return;
    }
    try {
      const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
      setEvmAddress(accounts[0]);
    } catch {
      setError('Failed to connect MetaMask');
    }
  };

  const getRiskLabel = (score: number) => {
    if (score >= 65) return { label: 'Well Diversified', color: 'text-green-400 bg-green-400/10 border-green-400/20' };
    if (score >= 40) return { label: 'Moderate Risk', color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20' };
    return { label: 'High Concentration Risk', color: 'text-red-400 bg-red-400/10 border-red-400/20' };
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoTrade" />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Portfolio Intelligence</h1>
          <p className="text-gray-500 text-sm">Track holdings across BNB Chain, Ethereum, Polygon, Base, and Solana</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-400 mb-2">EVM Wallet (BNB / Ethereum / Polygon / Base)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={evmAddress}
                onChange={e => setEvmAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
              />
              <button onClick={connectMetaMask} className="px-4 py-3 border border-white/20 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/5 transition-colors whitespace-nowrap">
                Connect MetaMask
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-400 mb-2">Solana Wallet (optional)</label>
            <input
              type="text"
              value={solanaAddress}
              onChange={e => setSolanaAddress(e.target.value)}
              placeholder="Solana address..."
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
            />
          </div>

          {error && <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-4">{error}</div>}

          <button onClick={handleFetch} disabled={loading} className="w-full py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50">
            {loading ? 'Fetching portfolio data...' : 'Analyze Portfolio'}
          </button>
        </div>

        {data && (
          <div className="space-y-5">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-500">Total Portfolio Value</p>
                  <p className="text-3xl font-bold text-white">${data.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <span className={"px-4 py-2 rounded-xl text-sm font-medium border " + getRiskLabel(data.diversificationScore).color}>
                  {getRiskLabel(data.diversificationScore).label}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.holdings.map((h: any, i: number) => (
                  <div key={i} className="border border-white/10 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-white">{h.chain}</p>
                      <p className="text-sm text-gray-500">{h.balance.toFixed(5)} {h.symbol}</p>
                    </div>
                    <p className="font-bold text-white">${h.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>
            </div>

            {data.allocation.length > 0 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <h3 className="font-semibold text-white mb-4">Asset Allocation</h3>
                <div className="space-y-3">
                  {data.allocation.map((a: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{a.chain} ({a.symbol})</span>
                        <span className="text-gray-400">{a.percent.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: a.percent + '%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}