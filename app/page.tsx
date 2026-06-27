'use client';

import { useState, useEffect } from 'react';
import Nav from './components/Nav';

function ContactModal({ type, onClose }: { type: 'investment' | 'partnership'; onClose: () => void }) {
  const [form, setForm] = useState({ name: '', email: '', company: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const isInvestment = type === 'investment';

  const handleSend = async () => {
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setSending(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, type }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send. Please try again.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }} />
      <div className="relative w-full max-w-lg rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(145deg, #111827, #0d1117)', border: '1px solid rgba(255,255,255,0.08)', boxShadow: '0 40px 80px rgba(0,0,0,0.6)' }}>

        {/* Header */}
        <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-white">{isInvestment ? '💼 Investment Enquiry' : '🤝 Partnership Enquiry'}</h2>
            <p className="text-xs text-gray-500 mt-1">{isInvestment ? 'Reach out about ART token, funding rounds, or investor relations' : 'Reach out about CEX listings, revenue sharing, or co-marketing'}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors bg-transparent border-0 cursor-pointer" style={{ background: 'rgba(255,255,255,0.05)' }}>✕</button>
        </div>

        <div className="px-8 py-6">
          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>✓</div>
              <h3 className="text-xl font-black text-white mb-2">Message Sent!</h3>
              <p className="text-gray-400 text-sm mb-6">Thank you {form.name}. We'll get back to you at {form.email} within 24 hours.</p>
              <button onClick={onClose} className="px-6 py-2.5 rounded-xl text-sm font-bold text-black" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                Close
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Full Name *</label>
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="John Smith"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
                <div>
                  <label className="text-xs text-gray-500 font-medium mb-1.5 block">Email Address *</label>
                  <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="john@company.com"
                    className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Company / Organisation</label>
                <input type="text" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  placeholder={isInvestment ? 'Investment firm, VC, or fund name' : 'Exchange or company name'}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>
              <div>
                <label className="text-xs text-gray-500 font-medium mb-1.5 block">Message *</label>
                <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder={isInvestment ? 'Tell us about your investment interest, ticket size, and any questions about the ART token or funding rounds...' : 'Tell us about your exchange, the partnership opportunity you have in mind, and what you are looking to achieve...'}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none transition-colors resize-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </div>

              {error && <p className="text-red-400 text-xs">{error}</p>}

              <div className="flex gap-3 pt-2">
                <button onClick={handleSend} disabled={sending}
                  className="flex-1 py-3 rounded-xl text-sm font-black text-black transition-all disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245,158,11,0.3)' }}>
                  {sending ? 'Sending...' : `Send ${isInvestment ? 'Investment' : 'Partnership'} Enquiry →`}
                </button>
                <button onClick={onClose} className="px-5 py-3 rounded-xl text-sm text-gray-400 transition-colors bg-transparent border-0 cursor-pointer hover:text-white"
                  style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [assets, setAssets] = useState<any[]>([]);
  const [marketStats, setMarketStats] = useState<any>(null);
  const [riskSentiment, setRiskSentiment] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [contactModal, setContactModal] = useState<'investment' | 'partnership' | null>(null);
  const [userCount, setUserCount] = useState('600+');
 useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    fetchMacroData();
    fetch('/api/stats').then(r => r.json()).then(d => {
      if (d.success) setUserCount(d.displayCount);
    }).catch(() => {});
  }, []);

  const fetchMacroData = async () => {
    try {
      const res = await fetch('/api/macro');
      const data = await res.json();
      if (data.success) {
        setAssets(data.assets.slice(0, 8));
        setMarketStats(data.marketStats);
        setRiskSentiment(data.riskSentiment);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number, type?: string) => {
    if (!price) return '$0';
    if (type === 'forex') return price.toFixed(4);
    if (price >= 1000) return '$' + price.toLocaleString(undefined, { maximumFractionDigits: 0 });
    if (price >= 1) return '$' + price.toFixed(2);
    return '$' + price.toFixed(6);
  };

  const formatChange = (change: number) => {
    if (!change && change !== 0) return '—';
    return (change >= 0 ? '+' : '') + change.toFixed(2) + '%';
  };

  const formatLarge = (num: number) => {
    if (!num) return '—';
    if (num >= 1e12) return '$' + (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return '$' + (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return '$' + (num / 1e6).toFixed(2) + 'M';
    return '$' + num.toLocaleString();
  };

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #0d1117 50%, #0a0a0a 100%)' }}>
      <Nav active="Intelligence" />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 20% 50%, rgba(245,158,11,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(59,130,246,0.06) 0%, transparent 60%)' }} />
        <div className="absolute top-20 right-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(60px)' }} />
        <div className="absolute bottom-20 left-0 w-96 h-96 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(60px)' }} />

        <div className="relative max-w-screen-xl mx-auto px-4 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-semibold mb-8 uppercase tracking-widest">
                🪙 ART Token TGE — Q3 2026 · $0.20 Public Sale
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-tight mb-6 tracking-tight">
                Trade Smarter.<br />
                <span style={{ background: 'linear-gradient(135deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  Learn Faster.
                </span><br />
                Earn More.
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
                AureoTrack is the world's most comprehensive trading intelligence platform — combining real-time market data, AI-powered analysis, professional demo trading, and world-class education for the next generation of global traders.
              </p>
              <div className="flex gap-4 flex-wrap mb-10">
                <button onClick={() => window.location.href = '/register'} className="px-8 py-4 rounded-2xl text-base font-black text-black transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 30px rgba(245,158,11,0.35)' }}>
                  Start Trading Free →
                </button>
                <button onClick={() => window.location.href = '/pitch-deck'} className="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.05)' }}>
                  View Pitch Deck
                </button>
              </div>
             <div className="flex items-center gap-6 flex-wrap">
                {[
                  { value: userCount, label: 'Traders' },
                  { value: '58+', label: 'Features' },
                  { value: '$3M', label: 'Raised' },
                  { value: 'Q3 2026', label: 'TGE' },
                ].map(stat => (
                  <div key={stat.label} className="text-center">
                    <p className="text-xl font-black text-white">{stat.value}</p>
                    <p className="text-xs text-gray-600">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Live Market Mini-Preview */}
            <div className="relative">
              <div className="rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #111827, #0d1117)', boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
                <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-xs text-gray-400 font-medium">Live Market Data</span>
                  </div>
                  {marketStats && (
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-green-400">▲ {marketStats.gainers} gainers</span>
                      <span className="text-red-400">▼ {marketStats.losers} losers</span>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  {loading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-6 h-6 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {assets.slice(0, 6).map((asset, i) => (
                        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors cursor-pointer" onClick={() => window.location.href = '/markets'}>
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0" style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>
                              {asset.symbol?.slice(0, 2)}
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white">{asset.name}</p>
                              <p className="text-xs text-gray-600">{asset.symbol}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-semibold text-white">{formatPrice(asset.current_price, asset.type)}</p>
                            <p className={"text-xs font-medium " + ((asset.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                              {formatChange(asset.price_change_percentage_24h || 0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-600">Showing top assets</span>
                  <button onClick={() => window.location.href = '/markets'} className="text-xs text-yellow-400 hover:text-yellow-300 font-semibold transition-colors bg-transparent border-0 cursor-pointer">
                    View all 40+ assets →
                  </button>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-4 py-2 rounded-xl text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245,158,11,0.4)' }}>
                🤖 AI-Powered
              </div>
              <div className="absolute -bottom-4 -left-4 px-4 py-2 rounded-xl text-xs font-bold text-white" style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', boxShadow: '0 8px 20px rgba(29,78,216,0.4)' }}>
                📈 Live Charts
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER BAR ── */}
      <div className="border-y border-white/10 py-3 overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-8 animate-none overflow-x-auto px-4 whitespace-nowrap scrollbar-none">
          {assets.map((asset, i) => (
            <div key={i} className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-gray-500">{asset.symbol}</span>
              <span className="text-xs font-semibold text-white">{formatPrice(asset.current_price, asset.type)}</span>
              <span className={"text-xs font-medium " + ((asset.price_change_percentage_24h || 0) >= 0 ? 'text-green-400' : 'text-red-400')}>
                {formatChange(asset.price_change_percentage_24h || 0)}
              </span>
            </div>
          ))}
          <button onClick={() => window.location.href = '/markets'} className="text-xs text-yellow-400 flex-shrink-0 bg-transparent border-0 cursor-pointer">View all →</button>
        </div>
      </div>

      {/* ── STATS BAR ── */}
      <section className="py-12 px-4 border-b border-white/10" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <div className="max-w-screen-xl mx-auto grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 text-center">
          {[
            { value: '58+', label: 'Platform Features', color: '#f59e0b' },
            { value: '40+', label: 'Live Assets', color: '#3b82f6' },
            { value: '60+', label: 'Academy Lessons', color: '#10b981' },
            { value: '6', label: 'Trading Schools', color: '#8b5cf6' },
            { value: '22', label: 'Trading Pairs', color: '#ec4899' },
            { value: '9', label: 'Exchange Sources', color: '#f97316' },
            { value: '$3M', label: 'Raised', color: '#06b6d4' },
            { value: '2', label: 'Global Chapters', color: '#f59e0b' },
          ].map(stat => (
            <div key={stat.label} className="flex flex-col items-center">
              <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5 PRODUCTS ── */}
      <section className="py-20 px-4">
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-3">Five Integrated Products</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Everything a trader needs,<br /><span style={{ color: '#f59e0b' }}>in one platform.</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">From real-time market intelligence to AI analysis, demo trading, world-class education, and a global community — AureoTrack has it all.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
            {/* Big card */}
            <div className="lg:col-span-2 rounded-3xl p-8 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => window.location.href = '/markets'}
              style={{ background: 'linear-gradient(135deg, #111827, #1a2436)', boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)' }}>
              <div className="absolute top-0 right-0 w-64 h-64 opacity-10" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(40px)' }} />
              <div className="relative">
                <span className="text-4xl mb-4 block">📊</span>
                <h3 className="text-2xl font-black text-white mb-2">AureoTrack Intelligence</h3>
                <p className="text-gray-400 mb-6">Real-time prices across 40+ assets, BTC/Gold correlation analysis, live news from 200+ sources, and an exchange arbitrage scanner across 9 major venues.</p>
                <div className="flex gap-2 flex-wrap">
                  {['40+ Assets', 'Live News', 'Arbitrage Scanner', 'BTC/Gold Chart'].map(tag => (
                    <span key={tag} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>

            <div className="rounded-3xl p-8 relative overflow-hidden cursor-pointer hover:scale-[1.01] transition-transform" onClick={() => window.location.href = '/trade'}
              style={{ background: 'linear-gradient(135deg, #0d1f12, #0a1a0f)', boxShadow: '0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(16,185,129,0.1)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 opacity-10" style={{ background: 'radial-gradient(circle, #10b981, transparent)', filter: 'blur(40px)' }} />
              <div className="relative">
                <span className="text-4xl mb-4 block">📈</span>
                <h3 className="text-xl font-black text-white mb-2">AureoTrade</h3>
                <p className="text-gray-400 text-sm mb-4">Demo trading terminal with Lightweight Charts, 22 pairs, spot + futures up to 20x leverage.</p>
                <div className="flex gap-2 flex-wrap">
                  {['22 Pairs', 'Live Charts', '20x Leverage'].map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              { icon: '🎓', name: 'AureoAcademy', desc: '6 schools, 60+ AI lessons, certifications, and live online training programs from $149.', tags: ['6 Schools', '60+ Lessons', 'Certifications'], href: '/academy', color: '#f59e0b', bg: '#1a1500', border: 'rgba(245,158,11,0.1)' },
              { icon: '🤖', name: 'AureoAI', desc: 'Claude-powered market analysis with probability forecasts and event impact simulation.', tags: ['AI Analysis', 'Event Simulator', 'AI Mentor'], href: '/ai', color: '#8b5cf6', bg: '#120d1a', border: 'rgba(139,92,246,0.1)' },
              { icon: '🌐', name: 'AureoCommunity', desc: 'Discussion rooms, leaderboards, trading challenges, and the ART token airdrop whitelist.', tags: ['Discussions', 'Leaderboard', 'Airdrop'], href: '/community', color: '#ec4899', bg: '#1a0d12', border: 'rgba(236,72,153,0.1)' },
            ].map(product => (
              <div key={product.name} className="rounded-3xl p-6 cursor-pointer hover:scale-[1.02] transition-transform" onClick={() => window.location.href = product.href}
                style={{ background: `linear-gradient(135deg, ${product.bg}, #0a0a0a)`, boxShadow: '0 20px 60px rgba(0,0,0,0.4)', border: `1px solid ${product.border}` }}>
                <span className="text-3xl mb-3 block">{product.icon}</span>
                <h3 className="text-lg font-black text-white mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm mb-4 leading-relaxed">{product.desc}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {product.tags.map(tag => (
                    <span key={tag} className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ background: `${product.color}12`, color: product.color, border: `1px solid ${product.color}25` }}>{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR INVESTORS & CEX ── */}
      <section className="py-20 px-4" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-3">Investment Opportunity</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Built for the future of<br /><span style={{ color: '#f59e0b' }}>global trading.</span></h2>
            <p className="text-gray-500 max-w-2xl mx-auto">AureoTrack is raising capital to scale the platform globally. $3M raised across Angel, Private Sale, and Grants. Public sale at $0.20/ART in Q3 2026.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
            {/* Token card */}
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1200, #111000)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 opacity-20" style={{ background: 'radial-gradient(circle, #f59e0b, transparent)', filter: 'blur(40px)' }} />
              <div className="relative">
                <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-4">🪙 ART Token</p>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: 'Total Supply', value: '1,000,000,000' },
                    { label: 'Public Sale Price', value: '$0.20' },
                    { label: 'Initial Circulating', value: '12% at TGE' },
                    { label: 'TGE Date', value: 'Q3 2026' },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.15)' }}>
                      <p className="text-xs text-gray-500 mb-1">{s.label}</p>
                      <p className="text-sm font-black text-yellow-400">{s.value}</p>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => window.location.href = '/tokenomics'} className="px-5 py-2.5 rounded-xl text-sm font-bold text-black transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    View Tokenomics →
                  </button>
                  <button onClick={() => window.location.href = '/airdrop'} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-yellow-400 transition-all" style={{ border: '1px solid rgba(245,158,11,0.3)', background: 'transparent' }}>
                    Join Airdrop
                  </button>
                </div>
              </div>
            </div>

            {/* Funding card */}
            <div className="rounded-3xl p-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0d1520, #0a1018)', border: '1px solid rgba(59,130,246,0.2)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
              <div className="absolute top-0 right-0 w-48 h-48 opacity-20" style={{ background: 'radial-gradient(circle, #3b82f6, transparent)', filter: 'blur(40px)' }} />
              <div className="relative">
                <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">💼 Funding Rounds</p>
                <div className="space-y-3 mb-6">
                  {[
                    { round: 'Angel Round', amount: '$700,000', price: '$0.15/ART', date: 'Q1 2025', status: 'Closed' },
                    { round: 'Private Sale', amount: '$2,000,000', price: '$0.18/ART', date: 'Q2 2026', status: 'Closed' },
                    { round: 'Grants', amount: '$300,000', price: 'Non-dilutive', date: 'Q2 2026', status: 'Received' },
                    { round: 'Public Sale', amount: '$30M target', price: '$0.20/ART', date: 'Q3 2026', status: 'Upcoming' },
                  ].map(r => (
                    <div key={r.round} className="flex items-center justify-between py-2.5 border-b border-white/5">
                      <div>
                        <p className="text-sm font-semibold text-white">{r.round}</p>
                        <p className="text-xs text-gray-500">{r.price} · {r.date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-white">{r.amount}</p>
                        <span className={"text-xs font-bold " + (r.status === 'Upcoming' ? 'text-yellow-400' : 'text-green-400')}>✓ {r.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  <button onClick={() => window.location.href = '/pitch-deck'} className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' }}>
                    View Pitch Deck →
                  </button>
                  <button onClick={() => window.location.href = '/whitepaper'} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-blue-400 transition-all" style={{ border: '1px solid rgba(59,130,246,0.3)', background: 'transparent' }}>
                    Whitepaper
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* CEX Partnership */}
          <div className="rounded-3xl p-8 text-center" style={{ background: 'linear-gradient(135deg, #0d120d, #0a0f0a)', border: '1px solid rgba(16,185,129,0.15)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <p className="text-green-400 text-xs font-bold uppercase tracking-widest mb-3">🤝 CEX Partnerships</p>
            <h3 className="text-2xl font-black text-white mb-3">Partner with AureoTrack</h3>
            <p className="text-gray-500 max-w-2xl mx-auto mb-6 text-sm">We're actively seeking CEX partnerships for exchange listings, revenue sharing through our arbitrage scanner, and co-marketing opportunities. Our platform drives verified traders directly to partner exchanges.</p>
            <div className="flex gap-4 justify-center flex-wrap mb-6">
              {['Exchange Listings', 'Revenue Sharing', 'Co-Marketing', 'API Integration', 'User Referrals'].map(tag => (
                <span key={tag} className="px-3 py-1.5 rounded-full text-xs font-medium" style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}>{tag}</span>
              ))}
            </div>
           <button onClick={() => setContactModal('partnership')} className="px-8 py-3 rounded-xl text-sm font-bold text-black transition-all" style={{ background: 'linear-gradient(135deg, #10b981, #059669)', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' }}>
              Contact for Partnership →
            </button>
          </div>
        </div>
      </section>

      {/* ── ACADEMY ── */}
      <section className="py-20 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-3">AureoAcademy</p>
              <h2 className="text-4xl font-black text-white mb-4">World-class trading<br /><span style={{ color: '#f59e0b' }}>education.</span></h2>
              <p className="text-gray-500 mb-8 leading-relaxed">From complete beginner to professional trader — AureoAcademy covers every aspect of trading through AI-generated lessons, quizzes, certifications, and live cohort-based training programs.</p>
              <div className="space-y-3 mb-8">
                {[
                  { icon: '📚', label: '6 Specialized Schools', desc: 'Beginner, Forex, Crypto, Technical Analysis, Risk Management, Psychology' },
                  { icon: '🤖', label: '60+ AI-Generated Lessons', desc: 'Every lesson generated fresh by Claude AI with quizzes and key takeaways' },
                  { icon: '🏆', label: 'Certifications', desc: 'Complete a school to earn a globally recognized certificate' },
                  { icon: '🎥', label: 'Live Online Training', desc: 'Cohort-based programs from $149 — taught by experienced traders' },
                ].map(item => (
                  <div key={item.label} className="flex items-start gap-4 p-4 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="font-semibold text-white text-sm">{item.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => window.location.href = '/academy'} className="px-8 py-3 rounded-xl text-sm font-bold text-black transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245,158,11,0.3)' }}>
                Explore AureoAcademy →
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎓', school: 'Beginner School', lessons: '15 lessons', level: 'Level 1', color: '#3b82f6' },
                { icon: '💱', school: 'Forex Academy', lessons: '15 lessons', level: 'Level 2', color: '#10b981' },
                { icon: '₿', school: 'Crypto Academy', lessons: '15 lessons', level: 'Level 2', color: '#f59e0b' },
                { icon: '📊', school: 'Technical Analysis', lessons: '15 lessons', level: 'Level 3', color: '#8b5cf6' },
                { icon: '🛡️', school: 'Risk Management', lessons: '15 lessons', level: 'Level 3', color: '#ec4899' },
                { icon: '🧠', school: 'Psychology', lessons: '15 lessons', level: 'Level 4', color: '#f97316' },
              ].map(school => (
                <div key={school.school} className="rounded-2xl p-4 cursor-pointer hover:scale-105 transition-transform" onClick={() => window.location.href = '/academy'}
                  style={{ background: `${school.color}10`, border: `1px solid ${school.color}25` }}>
                  <span className="text-2xl mb-2 block">{school.icon}</span>
                  <p className="text-xs font-bold text-white mb-0.5">{school.school}</p>
                  <p className="text-xs text-gray-500">{school.lessons}</p>
                  <span className="text-xs font-semibold" style={{ color: school.color }}>{school.level}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── GLOBAL PRESENCE ── */}
      <section className="py-20 px-4" style={{ background: 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-yellow-400 text-sm font-semibold uppercase tracking-widest mb-3">Global Presence</p>
            <h2 className="text-4xl font-black text-white mb-4">Built for traders<br /><span style={{ color: '#f59e0b' }}>everywhere.</span></h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            <div className="lg:col-span-2 rounded-3xl overflow-hidden relative" style={{ height: '260px' }}>
              <img src="/academy/photos/live-event.jpeg" alt="AureoTrack Live Event" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold">Live Trading Events</p>
                <p className="text-gray-300 text-xs">In-person and online sessions</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden relative" style={{ height: '260px' }}>
              <img src="/academy/photos/asia-chapter.jpeg" alt="Asia Chapter" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-sm">Asia Chapter</p>
                <p className="text-gray-300 text-xs">Southeast Asia</p>
              </div>
            </div>
            <div className="rounded-3xl overflow-hidden relative" style={{ height: '260px' }}>
              <img src="/academy/photos/africa-chapter.jpeg" alt="Africa Chapter" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
              <div className="absolute bottom-4 left-4">
                <p className="text-white font-bold text-sm">Africa Chapter</p>
                <p className="text-gray-300 text-xs">Sub-Saharan Africa</p>
              </div>
            </div>
          </div>

          {/* Founder */}
          <div className="rounded-3xl p-8 flex flex-col sm:flex-row gap-8 items-center" style={{ background: 'linear-gradient(135deg, #111827, #0d1117)', border: '1px solid rgba(255,255,255,0.06)', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}>
            <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
              <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex-1">
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest mb-1">Founder & CEO</p>
              <h3 className="text-xl font-black text-white mb-2">Glean Moore</h3>
              <p className="text-gray-400 text-sm leading-relaxed">Visionary founder of AureoTrack since 2025. Built a 58-feature trading intelligence platform from scratch, with chapter presence across Asia and Africa and a mission to democratize professional trading tools for the next generation of global traders.</p>
            </div>
            <div className="flex flex-col gap-2 flex-shrink-0">
              <a href="https://x.com/aureotrack" target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl text-xs font-semibold text-white flex items-center gap-2 transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                @aureotrack
              </a>
              <button onClick={() => window.location.href = '/about'} className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 transition-all hover:text-white" style={{ border: '1px solid rgba(255,255,255,0.06)' }}>
                Learn More →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl p-12 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1200, #111000)', border: '1px solid rgba(245,158,11,0.2)', boxShadow: '0 40px 80px rgba(0,0,0,0.5)' }}>
            <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, #f59e0b, transparent 70%)' }} />
            <div className="relative">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-14 h-14 rounded-2xl mx-auto mb-6 object-cover" style={{ boxShadow: '0 0 30px rgba(245,158,11,0.4)' }} />
              <h2 className="text-4xl font-black text-white mb-3">Start trading smarter today.</h2>
              <p className="text-gray-400 mb-8">Join AureoTrack — 100% free. Access all 5 products, demo trade with $100,000, earn certifications, and get whitelisted for the ART token airdrop.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <button onClick={() => window.location.href = user ? '/trade' : '/register'} className="px-8 py-4 rounded-2xl text-base font-black text-black transition-all hover:scale-105" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 30px rgba(245,158,11,0.4)' }}>
                  {user ? 'Go to Trading →' : 'Create Free Account →'}
                </button>
                <button onClick={() => setContactModal('investment')} className="px-8 py-4 rounded-2xl text-base font-semibold text-white transition-all hover:bg-white/10" style={{ border: '1px solid rgba(255,255,255,0.15)' }}>
                  Contact for Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Modal */}
      {contactModal && <ContactModal type={contactModal} onClose={() => setContactModal(null)} />}

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 py-12 px-4" style={{ background: 'rgba(0,0,0,0.3)' }}>
        <div className="max-w-screen-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-10 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-3 mb-4">
                <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-9 h-9 rounded-xl object-cover" />
                <div>
                  <p className="font-black text-white">AureoTrack</p>
                  <p className="text-xs text-gray-600">Macro & Trading Intelligence</p>
                </div>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">Democratizing access to professional trading tools, AI-powered intelligence, and world-class education for traders globally.</p>
              <div className="flex gap-2">
                {[
                  { href: 'https://x.com/aureotrack', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
                  { href: 'https://t.me/aureo_track', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.86l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.726z"/></svg> },
                  { href: 'https://t.me/Aureotrackofficial', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.86l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.726z"/></svg> },
                ].map((s, i) => (
                  <a key={i} href={s.href} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
              {[
                { title: 'Platform', links: [['/', 'Market Overview'], ['/trade', 'AureoTrade'], ['/crypto', 'Crypto Scanner'], ['/exchanges', 'Arbitrage'], ['/portfolio', 'Portfolio']] },
                { title: 'Learn', links: [['/academy', 'AureoAcademy'], ['/training', 'Live Training'], ['/ai', 'AureoAI'], ['/community', 'Community'], ['/challenges', 'Challenges']] },
                { title: 'Invest', links: [['/tokenomics', 'Tokenomics'], ['/whitepaper', 'Whitepaper'], ['/pitch-deck', 'Pitch Deck'], ['/airdrop', 'Airdrop'], ['/about', 'About Us']] },
                { title: 'Account', links: [['/register', 'Sign Up Free'], ['/login', 'Login'], ['/trade', 'Demo Trade'], ['/leaderboard', 'Leaderboard'], ['mailto:contact@aureotrack.com', 'Contact']] },
              ].map(col => (
                <div key={col.title}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">{col.title}</p>
                  <ul className="space-y-2">
                    {col.links.map(([href, label]) => (
                      <li key={label}>
                        <button onClick={() => href.startsWith('mailto:') ? window.location.href = href : window.location.href = href} className="text-xs text-gray-600 hover:text-gray-300 transition-colors bg-transparent border-0 cursor-pointer text-left">
                          {label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-700">© 2025 AureoTrack. All rights reserved. Founded 2025.</p>
            <p className="text-xs text-gray-700">contact@aureotrack.com · aureotrack.com · @aureotrack</p>
          </div>
        </div>
      </footer>
    </div>
  );
}