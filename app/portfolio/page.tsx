'use client';

import { useState } from 'react';

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
    if (score >= 65) return { label: 'Well Diversified', color: 'text-green-600 bg-green-50 border-green-200' };
    if (score >= 40) return { label: 'Moderate Risk', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    return { label: 'High Concentration Risk', color: 'text-red-600 bg-red-50 border-red-200' };
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Portfolio Intelligence</h1>
          <p className="text-gray-500 text-sm mt-1">Connect your wallets to track holdings across BNB Chain, Ethereum, Polygon, Base, and Solana</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">EVM Wallet Address (BNB / Ethereum / Polygon / Base)</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={evmAddress}
                onChange={e => setEvmAddress(e.target.value)}
                placeholder="0x..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                onClick={connectMetaMask}
                className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors whitespace-nowrap"
              >
                Connect MetaMask
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Solana Wallet Address (optional)</label>
            <input
              type="text"
              value={solanaAddress}
              onChange={e => setSolanaAddress(e.target.value)}
              placeholder="Solana address..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-4">{error}</div>
          )}

          <button
            onClick={handleFetch}
            disabled={loading}
            className="w-full py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Fetching portfolio data...' : 'Analyze Portfolio'}
          </button>
        </div>

        {data && (
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-400">Total Portfolio Value</p>
                  <p className="text-3xl font-bold text-gray-900">${data.totalValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                </div>
                <span className={"px-4 py-2 rounded-xl text-sm font-medium border " + getRiskLabel(data.diversificationScore).color}>
                  {getRiskLabel(data.diversificationScore).label}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {data.holdings.map((h: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{h.chain}</p>
                      <p className="text-sm text-gray-400">{h.balance.toFixed(5)} {h.symbol}</p>
                    </div>
                    <p className="font-bold text-gray-900">${h.usdValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
                  </div>
                ))}
              </div>
            </div>

            {data.allocation.length > 0 && (
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4">Asset Allocation</h3>
                <div className="space-y-3">
                  {data.allocation.map((a: any, i: number) => (
                    <div key={i}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 font-medium">{a.chain} ({a.symbol})</span>
                        <span className="text-gray-500">{a.percent.toFixed(1)}%</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-black rounded-full" style={{ width: a.percent + '%' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}