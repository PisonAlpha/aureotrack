'use client';

import { useState, useEffect, useRef } from 'react';
import Nav from '../components/Nav';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const TIME_RANGES = [
  { label: '4H', days: 0.17 },
  { label: '1D', days: 1 },
  { label: '7D', days: 7 },
  { label: '14D', days: 14 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];

export default function BtcGold() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [correlation, setCorrelation] = useState<number>(0);
  const [activeRange, setActiveRange] = useState('1D');
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [btcPrice, setBtcPrice] = useState<number | null>(null);
  const [goldPrice, setGoldPrice] = useState<number | null>(null);

  useEffect(() => {
    fetchChart(activeRange);
  }, [activeRange]);

  useEffect(() => {
    fetchNews();
    fetchPrices();
  }, []);

  const fetchChart = async (range: string) => {
    setLoading(true);
    try {
      const tf = TIME_RANGES.find(t => t.label === range);
      const res = await fetch(`/api/chart?days=${tf?.days || 1}`);
      const data = await res.json();
      if (data.success) {
        setChartData(data.data);
        setCorrelation(data.correlation);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    setNewsLoading(true);
    try {
      const res = await fetch('/api/news');
      const data = await res.json();
      if (data.success) setNews(data.articles?.slice(0, 12) || []);
    } catch {} finally {
      setNewsLoading(false);
    }
  };

  const fetchPrices = async () => {
    try {
      const [btcRes, goldRes] = await Promise.all([
        fetch('/api/assets/price?symbol=BTC'),
        fetch('/api/assets/price?symbol=XAU'),
      ]);
      const btcData = await btcRes.json();
      const goldData = await goldRes.json();
      if (btcData.price) setBtcPrice(btcData.price);
      if (goldData.price) setGoldPrice(goldData.price);
    } catch {}
  };

  const correlationColor = correlation >= 0.5 ? '#10b981' : correlation <= -0.5 ? '#ef4444' : '#f59e0b';
  const correlationLabel = correlation >= 0.7 ? 'Strong Positive' : correlation >= 0.3 ? 'Moderate Positive' : correlation <= -0.7 ? 'Strong Negative' : correlation <= -0.3 ? 'Moderate Negative' : 'Neutral';

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div className="rounded-xl p-3 shadow-2xl" style={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-xs text-gray-400 mb-2">{label}</p>
          {payload.map((p: any) => (
            <p key={p.name} className="text-xs font-semibold" style={{ color: p.color }}>
              {p.name}: {p.name === 'BTC' ? '$' + p.payload.btc?.toLocaleString() : '$' + p.payload.gold?.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' }}>
      <Nav active="Intelligence" />

      {/* Header */}
      <div className="border-b border-white/10 py-10 px-4">
        <div className="max-w-screen-xl mx-auto">
          <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Market Intelligence</p>
          <h1 className="text-3xl font-black text-white mb-1">BTC / Gold Correlation</h1>
          <p className="text-gray-500 text-sm">Normalized price comparison and live market news</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Chart Section */}
          <div className="lg:col-span-2 space-y-6">

            {/* Price Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #1a1200, #111000)', border: '1px solid rgba(245,158,11,0.2)' }}>
                <p className="text-xs text-gray-500 mb-1">Bitcoin (BTC)</p>
                <p className="text-2xl font-black text-yellow-400">{btcPrice ? '$' + btcPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}</p>
              </div>
              <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #0d1520, #0a1018)', border: '1px solid rgba(59,130,246,0.2)' }}>
                <p className="text-xs text-gray-500 mb-1">Gold / XAUT</p>
                <p className="text-2xl font-black text-blue-400">{goldPrice ? '$' + goldPrice.toLocaleString(undefined, { maximumFractionDigits: 0 }) : '—'}</p>
              </div>
            </div>

            {/* Correlation Badge */}
            <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="text-xs text-gray-500 mb-0.5">Correlation Coefficient</p>
                <p className="text-lg font-black" style={{ color: correlationColor }}>{correlation.toFixed(2)} — {correlationLabel}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 mb-0.5">Interpretation</p>
                <p className="text-xs text-gray-400">{correlation >= 0.5 ? 'BTC and Gold moving together' : correlation <= -0.5 ? 'BTC and Gold moving opposite' : 'Weak relationship'}</p>
              </div>
            </div>

            {/* Time Range */}
            <div className="flex gap-2">
              {TIME_RANGES.map(tf => (
                <button key={tf.label} onClick={() => setActiveRange(tf.label)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium transition-all"
                  style={activeRange === tf.label
                    ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {tf.label}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-3xl p-6" style={{ background: 'linear-gradient(145deg, #111827, #0d1117)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-xs text-gray-500">Loading chart...</p>
                  </div>
                </div>
              ) : chartData.length === 0 ? (
                <div className="flex items-center justify-center h-64">
                  <p className="text-gray-500 text-sm">No chart data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={320}>
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="btcGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 100]} tickFormatter={v => v + '%'} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 11 }} />
                    <Area type="monotone" dataKey="btcNorm" stroke="#f59e0b" strokeWidth={2} fill="url(#btcGrad)" name="BTC" dot={false} />
                    <Area type="monotone" dataKey="goldNorm" stroke="#3b82f6" strokeWidth={2} fill="url(#goldGrad)" name="Gold" dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              )}
              <p className="text-xs text-gray-600 mt-3 text-center">Chart shows normalized price movement (0–100%) for direct comparison</p>
            </div>
       </div>

          {/* News Feed */}
          <div>
            <h2 className="text-lg font-black text-white mb-4">Live Market News</h2>
            {newsLoading ? (
              <div className="space-y-3">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <div className="h-3 rounded mb-2 animate-pulse" style={{ background: 'rgba(255,255,255,0.08)', width: '80%' }} />
                    <div className="h-3 rounded animate-pulse" style={{ background: 'rgba(255,255,255,0.05)', width: '50%' }} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {news.map((article, i) => (
                  <a key={i} href={article.url} target="_blank" rel="noopener noreferrer"
                    className="block rounded-2xl p-4 transition-all hover:scale-[1.01]"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className="text-sm font-semibold text-white mb-1 leading-snug line-clamp-2">{article.title}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">{article.source}</span>
                      <span className="text-gray-700">·</span>
                      <span className="text-xs text-gray-600">{article.published_at ? new Date(article.published_at).toLocaleDateString() : ''}</span>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}