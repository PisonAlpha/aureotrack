'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Markets() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [correlation, setCorrelation] = useState<number | null>(null);
  const [days, setDays] = useState(30);
  const [loadingChart, setLoadingChart] = useState(true);
  const [cryptoNews, setCryptoNews] = useState<any[]>([]);
  const [globalNews, setGlobalNews] = useState<any[]>([]);
  const [loadingNews, setLoadingNews] = useState(true);
  const [newsTab, setNewsTab] = useState<'crypto' | 'global'>('crypto');
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchChart(days);
    fetchNews();
    fetchPrices();
  }, []);

  useEffect(() => {
    fetchChart(days);
  }, [days]);

  const fetchChart = async (d: number) => {
    setLoadingChart(true);
    try {
      const res = await fetch('/api/chart?days=' + d);
      const data = await res.json();
      if (data.success) {
        setChartData(data.data);
        setCorrelation(data.correlation);
      }
    } catch {} finally {
      setLoadingChart(false);
    }
  };

  const fetchNews = async () => {
    setLoadingNews(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) {
        setCryptoNews(data.cryptoNews);
        setGlobalNews(data.globalNews);
      }
    } catch {} finally {
      setLoadingNews(false);
    }
  };

  const fetchPrices = async () => {
    try {
      const [btcRes, goldRes] = await Promise.all([
        fetch('/api/assets/price?symbol=BTC'),
        fetch('/api/assets/price?symbol=GOLD'),
      ]);
      const btcData = await btcRes.json();
      const goldData = await goldRes.json();
      if (btcData.success) setBtcPrice(btcData.price);
      if (goldData.success) setGoldPrice(goldData.price);
    } catch {}
  };

  const getCorrelationLabel = (c: number) => {
    if (c >= 0.7) return { label: 'Strong Positive', color: 'text-green-400' };
    if (c >= 0.3) return { label: 'Moderate Positive', color: 'text-yellow-400' };
    if (c >= -0.3) return { label: 'No Correlation', color: 'text-gray-400' };
    if (c >= -0.7) return { label: 'Moderate Negative', color: 'text-orange-400' };
    return { label: 'Strong Negative', color: 'text-red-400' };
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      const now = new Date();
      const diff = Math.floor((now.getTime() - d.getTime()) / 60000);
      if (diff < 60) return diff + 'm ago';
      if (diff < 1440) return Math.floor(diff / 60) + 'h ago';
      return Math.floor(diff / 1440) + 'd ago';
    } catch { return '' }
  };

  const news = newsTab === 'crypto' ? cryptoNews : globalNews;

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-white">AureoTrack</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {[['/', 'Markets'], ['/trade', 'Trade'], ['/crypto', 'Crypto'], ['/ai', 'AI Insights'], ['/academy', 'Academy']].map(([href, label]) => (
              <button key={label} onClick={() => window.location.href = href} className="px-3 py-1.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer">
                {label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Markets Intelligence</h1>
          <p className="text-gray-500 text-sm">BTC/Gold correlation tracker and live market news</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Bitcoin (BTC)</p>
            <p className="text-2xl font-bold text-white">{btcPrice ? '$' + btcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '...'}</p>
            <p className="text-xs text-blue-400 mt-1">Live price</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">Gold (XAU/USD)</p>
            <p className="text-2xl font-bold text-white">{goldPrice ? '$' + goldPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '...'}</p>
            <p className="text-xs text-yellow-400 mt-1">Live price</p>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-xs text-gray-500 mb-1">BTC/Gold Correlation</p>
            {correlation !== null ? (
              <>
                <p className="text-2xl font-bold text-white">{correlation > 0 ? '+' : ''}{correlation}</p>
                <p className={"text-xs mt-1 " + getCorrelationLabel(correlation).color}>{getCorrelationLabel(correlation).label}</p>
              </>
            ) : (
              <p className="text-2xl font-bold text-gray-500">...</p>
            )}
          </div>
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h2 className="font-semibold text-white">BTC vs Gold — Normalized Price Comparison</h2>
              <p className="text-xs text-gray-500 mt-0.5">Both assets normalized to 0-100 scale for comparison</p>
            </div>
            <div className="flex gap-2">
              {[7, 14, 30, 90].map(d => (
                <button key={d} onClick={() => setDays(d)} className={"px-3 py-1.5 rounded-lg text-xs font-medium transition-colors " + (days === d ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')}>
                  {d}D
                </button>
              ))}
            </div>
          </div>

          {loadingChart ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} interval={Math.floor(chartData.length / 6)} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => v + '%'} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                 formatter={(value: any, name: any) => [value.toFixed(1) + '%', name === 'btcNorm' ? 'Bitcoin' : 'Gold']}
                  labelStyle={{ color: '#9ca3af', fontSize: 12 }}
                />
                <Legend formatter={(value) => value === 'btcNorm' ? 'Bitcoin' : 'Gold'} wrapperStyle={{ color: '#9ca3af', fontSize: 12 }} />
                <Line type="monotone" dataKey="btcNorm" stroke="#f59e0b" strokeWidth={2} dot={false} name="btcNorm" />
                <Line type="monotone" dataKey="goldNorm" stroke="#a855f7" strokeWidth={2} dot={false} name="goldNorm" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500 text-sm">No chart data available</div>
          )}

          {correlation !== null && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="text-xs text-gray-500">
                Over the last {days} days, Bitcoin and Gold have a correlation coefficient of <span className={"font-semibold " + getCorrelationLabel(correlation).color}>{correlation > 0 ? '+' : ''}{correlation}</span> — indicating a <span className={getCorrelationLabel(correlation).color}>{getCorrelationLabel(correlation).label.toLowerCase()}</span> relationship. A value near +1 means they move together; near -1 means they move opposite; near 0 means no relationship.
              </p>
            </div>
          )}
        </div>

        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <h2 className="font-semibold text-white">Live News Feed</h2>
            <div className="flex gap-2">
              <button onClick={() => { setNewsTab('crypto'); }} className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (newsTab === 'crypto' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')}>
                🪙 Crypto News
              </button>
              <button onClick={() => { setNewsTab('global'); }} className={"px-4 py-2 rounded-xl text-sm font-medium transition-colors " + (newsTab === 'global' ? 'bg-white text-black' : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10')}>
                🌍 Global Economy
              </button>
            </div>
          </div>

          {loadingNews ? (
            <div className="text-center py-10">
              <div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : (
            <div className="space-y-3">
              {news.map((item, i) => (
                <button
                  key={i}
                  onClick={() => item.url !== '#' && window.open(item.url, '_blank')}
                  className="w-full text-left p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/8 hover:border-white/20 transition-all cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-white mb-1 leading-relaxed">{item.title}</p>
                      {item.summary && <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.summary}</p>}
                    </div>
                    <span className="text-yellow-500 text-lg flex-shrink-0">→</span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-gray-600">{item.source}</span>
                    <span className="text-xs text-gray-700">·</span>
                    <span className="text-xs text-gray-600">{formatTime(item.publishedAt)}</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          <button onClick={fetchNews} className="mt-4 w-full py-2.5 border border-white/10 text-gray-400 rounded-xl text-sm hover:bg-white/5 transition-colors bg-transparent cursor-pointer">
            Refresh News
          </button>
        </div>
      </div>
    </main>
  );
}