'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const ANALYZABLE_ASSETS = [
  { id: 'bitcoin', symbol: 'BTC', category: 'Crypto' },
  { id: 'ethereum', symbol: 'ETH', category: 'Crypto' },
  { id: 'binancecoin', symbol: 'BNB', category: 'Crypto' },
  { id: 'solana', symbol: 'SOL', category: 'Crypto' },
  { id: 'ripple', symbol: 'XRP', category: 'Crypto' },
  { id: 'dogecoin', symbol: 'DOGE', category: 'Crypto' },
  { id: 'cardano', symbol: 'ADA', category: 'Crypto' },
  { id: 'tron', symbol: 'TRX', category: 'Crypto' },
  { id: 'XAU', symbol: 'Gold', category: 'Commodity' },
  { id: 'EUR/USD', symbol: 'EUR/USD', category: 'Forex' },
  { id: 'GBP/USD', symbol: 'GBP/USD', category: 'Forex' },
  { id: 'USD/JPY', symbol: 'USD/JPY', category: 'Forex' },
];

export default function AIInsights() {
  const [selectedAsset, setSelectedAsset] = useState(ANALYZABLE_ASSETS[0]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [eventInput, setEventInput] = useState('');
  const [eventResult, setEventResult] = useState<any>(null);
  const [loadingEvent, setLoadingEvent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalysis(selectedAsset.id);
  }, [selectedAsset]);

  const fetchAnalysis = async (assetId: string) => {
    setLoadingAnalysis(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/market-analysis?asset=' + assetId);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message);
      setAnalysis(null);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const handleSimulateEvent = async () => {
    if (!eventInput.trim()) { setError('Describe a market event to simulate'); return; }
    setLoadingEvent(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/event-impact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event: eventInput }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEventResult(data.result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingEvent(false);
    }
  };

  const getOutlookColor = (outlook: string) => {
    if (outlook === 'Bullish') return 'text-green-400 bg-green-400/10 border-green-400/20';
    if (outlook === 'Bearish') return 'text-red-400 bg-red-400/10 border-red-400/20';
    return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  };

  const getDirectionColor = (direction: string) => {
    if (direction === 'Positive') return 'text-green-400 bg-green-400/10';
    if (direction === 'Negative') return 'text-red-400 bg-red-400/10';
    return 'text-gray-400 bg-white/5';
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoAI" />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">AureoAI — Market Intelligence</h1>
          <p className="text-gray-500 text-sm">AI-powered market analysis and event impact simulation</p>
        </div>

        {error && <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>}

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
          <div className="mb-6">
            <h2 className="font-semibold text-white mb-4">AI Market Analyst</h2>
            {['Crypto', 'Commodity', 'Forex'].map(category => (
              <div key={category} className="mb-4">
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">{category}</p>
                <div className="flex gap-2 flex-wrap">
                  {ANALYZABLE_ASSETS.filter(a => a.category === category).map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={"px-3 py-2 rounded-xl text-xs font-medium transition-colors " + (
                        selectedAsset.id === asset.id ? 'bg-yellow-500 text-black' : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/10'
                      )}
                    >
                      {asset.symbol}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {loadingAnalysis ? (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Analyzing {selectedAsset.symbol} market data...</p>
            </div>
          ) : analysis ? (
            <div>
              <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-500">{analysis.asset} Current Price</p>
                  <p className="text-3xl font-bold text-white">${analysis.currentPrice?.toLocaleString()}</p>
                </div>
                <span className={"px-4 py-2 rounded-xl text-sm font-semibold border " + getOutlookColor(analysis.analysis.outlook)}>
                  {analysis.analysis.outlook}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-green-400/10 border border-green-400/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-400">{analysis.analysis.bullishProbability}%</p>
                  <p className="text-xs text-gray-500 mt-1">Bullish</p>
                </div>
                <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-yellow-400">{analysis.analysis.neutralProbability}%</p>
                  <p className="text-xs text-gray-500 mt-1">Neutral</p>
                </div>
                <div className="bg-red-400/10 border border-red-400/20 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-400">{analysis.analysis.bearishProbability}%</p>
                  <p className="text-xs text-gray-500 mt-1">Bearish</p>
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-5 leading-relaxed">{analysis.analysis.summary}</p>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-400 mb-3">Key Factors</p>
                <ul className="space-y-2">
                  {analysis.analysis.keyFactors.map((factor: string, i: number) => (
                    <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                      <span className="text-yellow-500 mt-0.5">•</span> {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="font-semibold text-white mb-2">AI Event Impact Simulator</h2>
          <p className="text-sm text-gray-500 mb-5">Describe any market event and see its likely impact across all major asset classes.</p>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={eventInput}
              onChange={e => setEventInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSimulateEvent()}
              placeholder="e.g. Federal Reserve cuts interest rates by 0.5%"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
            />
            <button
              onClick={handleSimulateEvent}
              disabled={loadingEvent}
              className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
            >
              {loadingEvent ? 'Simulating...' : 'Simulate'}
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {['Fed cuts rates by 0.5%', 'Bitcoin ETF approved', 'Inflation reaches 5%', 'US recession declared', 'China bans crypto'].map(prompt => (
              <button key={prompt} onClick={() => setEventInput(prompt)} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors">
                {prompt}
              </button>
            ))}
          </div>

          {eventResult && (
            <div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                <p className="font-medium text-white mb-2">{eventResult.eventSummary}</p>
                <p className="text-sm text-gray-400 leading-relaxed">{eventResult.historicalContext}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {eventResult.impacts.map((impact: any, i: number) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white text-sm">{impact.asset}</span>
                      <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + getDirectionColor(impact.direction)}>
                        {impact.direction}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{impact.reasoning}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-600 italic">{eventResult.disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}