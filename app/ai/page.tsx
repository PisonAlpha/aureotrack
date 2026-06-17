'use client';

import { useState, useEffect } from 'react';

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
];;

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
    if (!eventInput.trim()) {
      setError('Describe a market event to simulate');
      return;
    }

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
    if (outlook === 'Bullish') return 'text-green-600 bg-green-50 border-green-200';
    if (outlook === 'Bearish') return 'text-red-600 bg-red-50 border-red-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getDirectionColor = (direction: string) => {
    if (direction === 'Positive') return 'text-green-600 bg-green-50';
    if (direction === 'Negative') return 'text-red-600 bg-red-50';
    return 'text-gray-600 bg-gray-50';
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
          <h1 className="text-2xl font-bold text-gray-900">AI Market Intelligence</h1>
          <p className="text-gray-500 text-sm mt-1">AI-powered market analysis and event impact simulation</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">{error}</div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8">
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-4">AI Market Analyst</h2>
            {['Crypto', 'Commodity', 'Forex'].map(category => (
              <div key={category} className="mb-3">
                <p className="text-xs text-gray-400 mb-2">{category}</p>
                <div className="flex gap-2 flex-wrap">
                  {ANALYZABLE_ASSETS.filter(a => a.category === category).map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => setSelectedAsset(asset)}
                      className={"px-3 py-2 rounded-xl text-xs font-medium transition-colors " + (
                        selectedAsset.id === asset.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Analyzing market data...</p>
            </div>
          ) : analysis ? (
            <div>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <div>
                  <p className="text-sm text-gray-400">{analysis.asset} Outlook</p>
                  <p className="text-2xl font-bold text-gray-900">${analysis.currentPrice?.toLocaleString()}</p>
                </div>
                <span className={"px-4 py-2 rounded-xl text-sm font-semibold border " + getOutlookColor(analysis.analysis.outlook)}>
                  {analysis.analysis.outlook}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-green-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{analysis.analysis.bullishProbability}%</p>
                  <p className="text-xs text-gray-500 mt-1">Bullish</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-amber-600">{analysis.analysis.neutralProbability}%</p>
                  <p className="text-xs text-gray-500 mt-1">Neutral</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 text-center">
                  <p className="text-2xl font-bold text-red-600">{analysis.analysis.bearishProbability}%</p>
                  <p className="text-xs text-gray-500 mt-1">Bearish</p>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-4 leading-relaxed">{analysis.analysis.summary}</p>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs font-medium text-gray-700 mb-2">Key Factors</p>
                <ul className="space-y-1">
                  {analysis.analysis.keyFactors.map((factor: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400">•</span> {factor}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="font-semibold text-gray-900 mb-4">AI Event Impact Simulator</h2>
          <p className="text-sm text-gray-500 mb-4">Describe a market event or scenario and see its likely impact across asset classes.</p>

          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={eventInput}
              onChange={e => setEventInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSimulateEvent()}
              placeholder="e.g. Federal Reserve cuts interest rates by 0.5%"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button
              onClick={handleSimulateEvent}
              disabled={loadingEvent}
              className="px-6 py-3 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loadingEvent ? 'Simulating...' : 'Simulate'}
            </button>
          </div>

          {eventResult && (
            <div>
              <p className="font-medium text-gray-900 mb-2">{eventResult.eventSummary}</p>
              <p className="text-sm text-gray-600 mb-6">{eventResult.historicalContext}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {eventResult.impacts.map((impact: any, i: number) => (
                  <div key={i} className="border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900 text-sm">{impact.asset}</span>
                      <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + getDirectionColor(impact.direction)}>
                        {impact.direction}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{impact.reasoning}</p>
                  </div>
                ))}
              </div>

              <p className="text-xs text-gray-400 italic">{eventResult.disclaimer}</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}