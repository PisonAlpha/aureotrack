'use client';

import { useState } from 'react';
import Nav from '../components/Nav';

const SLIDES = [
  {
    id: 1,
    title: 'AureoTrack',
    subtitle: 'Macro & Trading Intelligence Platform',
    type: 'cover',
  },
  {
    id: 2,
    title: 'The Problem',
    subtitle: 'Why retail traders fail',
    type: 'problem',
  },
  {
    id: 3,
    title: 'The Solution',
    subtitle: 'AureoTrack — Everything a trader needs',
    type: 'solution',
  },
  {
    id: 4,
    title: 'Product Suite',
    subtitle: 'Five integrated products',
    type: 'products',
  },
  {
    id: 5,
    title: 'Market Opportunity',
    subtitle: 'A massive underserved market',
    type: 'market',
  },
  {
    id: 6,
    title: 'Traction',
    subtitle: 'What we have built',
    type: 'traction',
  },
  {
    id: 7,
    title: 'Business Model',
    subtitle: 'Multiple revenue streams',
    type: 'business',
  },
  {
    id: 8,
    title: 'ART Tokenomics',
    subtitle: '1 Billion ART Token',
    type: 'tokenomics',
  },
  {
    id: 9,
    title: 'Funding & Use of Funds',
    subtitle: '$3M raised — deploying for growth',
    type: 'funding',
  },
  {
    id: 10,
    title: 'Roadmap',
    subtitle: 'Path to global scale',
    type: 'roadmap',
  },
  {
    id: 11,
    title: 'Team',
    subtitle: 'Led by a visionary founder',
    type: 'team',
  },
  {
    id: 12,
    title: 'Join AureoTrack',
    subtitle: 'Invest in the future of trading intelligence',
    type: 'cta',
  },
];

function SlideContent({ type }: { type: string }) {
  switch (type) {
    case 'cover':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-24 h-24 rounded-3xl object-cover mb-8 shadow-2xl" />
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4">AureoTrack</h1>
          <p className="text-xl text-yellow-400 font-medium mb-6">Macro & Trading Intelligence Platform</p>
          <p className="text-gray-400 max-w-xl leading-relaxed">Democratizing access to professional-grade trading tools, AI-powered market intelligence, and world-class education for the next generation of global traders.</p>
          <div className="flex gap-4 mt-8 flex-wrap justify-center">
            <div className="px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-sm">$3M Raised</div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm">52+ Features</div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-gray-300 text-sm">Q3 2026 TGE</div>
          </div>
        </div>
      );

    case 'problem':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: '🚫', title: 'Information Asymmetry', desc: 'Retail traders lack access to the real-time data institutional traders use' },
              { icon: '💸', title: 'Expensive Tools', desc: 'Bloomberg Terminal costs $24,000/year — unaffordable for retail traders' },
              { icon: '📚', title: 'Poor Education', desc: 'Most trading education is low quality or taught by unqualified instructors' },
              { icon: '🌍', title: 'Geographic Exclusion', desc: 'Traders in Africa and Asia excluded from best platforms by geo-restrictions' },
              { icon: '⚡', title: 'Fragmented Tools', desc: 'Traders use 5-10 apps for different needs, creating friction and inefficiency' },
              { icon: '🎰', title: '80% Failure Rate', desc: 'Most retail traders lose money due to lack of proper tools and education' },
            ].map(p => (
              <div key={p.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <span className="text-xl mb-1 block">{p.icon}</span>
                <p className="text-sm font-semibold text-white mb-1">{p.title}</p>
                <p className="text-xs text-gray-500">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'solution':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6 mb-4">
            <p className="text-lg text-white font-semibold mb-2">One platform. Everything a trader needs.</p>
            <p className="text-gray-400 text-sm">AureoTrack combines real-time market intelligence, AI-powered analysis, professional demo trading, world-class education, and a global community — all in one unified platform, free to use.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              '✓ Real-time data from 40+ assets (crypto, forex, gold)',
              '✓ AI market analysis with probability forecasts',
              '✓ TradingView live charts with full technical tools',
              '✓ Arbitrage scanner across 9 CEX + DEX sources',
              '✓ 60+ AI-generated trading lessons and certifications',
              '✓ Multi-chain portfolio tracking across 5 networks',
            ].map((point, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300">
                {point}
              </div>
            ))}
          </div>
        </div>
      );

    case 'products':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: '📊', name: 'AureoTrack Intelligence', desc: 'Real-time market data, BTC/Gold correlation, arbitrage scanner, live news' },
              { icon: '📈', name: 'AureoTrade', desc: 'Demo trading terminal with TradingView charts, 22 pairs, spot & futures' },
              { icon: '🎓', name: 'AureoAcademy', desc: '6 schools, 60+ lessons, certifications, live online training programs' },
              { icon: '🤖', name: 'AureoAI', desc: 'AI market analysis, event simulator, AI mentor, site-wide AI assistant' },
              { icon: '🌐', name: 'AureoCommunity', desc: 'Discussion rooms, leaderboards, challenges, global chapters, airdrop whitelist' },
            ].map(product => (
              <div key={product.name} className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <span className="text-2xl flex-shrink-0">{product.icon}</span>
                <div>
                  <p className="text-sm font-semibold text-white">{product.name}</p>
                  <p className="text-xs text-gray-500">{product.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'market':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { value: '$3.2T+', label: 'Daily Forex Volume', sub: 'Global market' },
              { value: '425M+', label: 'Crypto Users', sub: '+15% YoY growth' },
              { value: '$12.7B', label: 'EdFintech Market', sub: 'By 2028' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-2xl font-black text-yellow-400">{stat.value}</p>
                <p className="text-sm font-medium text-white mt-1">{stat.label}</p>
                <p className="text-xs text-gray-500">{stat.sub}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
            <p className="text-sm text-gray-300 leading-relaxed">AureoTrack targets the <span className="text-yellow-400 font-semibold">underserved retail trader segment</span> in Africa and Asia — two of the world's fastest-growing trading markets with hundreds of millions of potential users seeking affordable, professional-grade trading tools and education.</p>
          </div>
        </div>
      );

    case 'traction':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { value: '52+', label: 'Platform Features', icon: '⚡' },
              { value: '60+', label: 'Academy Lessons', icon: '📚' },
              { value: '6', label: 'Trading Schools', icon: '🎓' },
              { value: '9', label: 'Exchange Sources', icon: '📊' },
              { value: '22', label: 'Trading Pairs', icon: '📈' },
              { value: '5', label: 'Blockchain Networks', icon: '🌐' },
              { value: '$3M', label: 'Total Raised', icon: '💰' },
              { value: '2', label: 'Global Chapters', icon: '🌍' },
              { value: 'Q3 2026', label: 'TGE Date', icon: '🪙' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <span className="text-2xl mb-1 block">{stat.icon}</span>
                <p className="text-xl font-black text-yellow-400">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'business':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-1 gap-3">
            {[
              { stream: 'ART Token Sales', desc: 'Public sale at $0.20 — $30M target at full raise', revenue: 'Primary' },
              { stream: 'Premium Subscriptions', desc: 'Pro tier unlocking advanced AI signals, priority data, and exclusive tools', revenue: 'Recurring' },
              { stream: 'Live Training Programs', desc: '$149-$299 per program with cohort-based enrollment', revenue: 'Recurring' },
              { stream: 'Exchange Partnerships', desc: 'Revenue sharing with exchanges referred through arbitrage scanner', revenue: 'Passive' },
              { stream: 'API Access', desc: 'White-label platform licensing and institutional API subscriptions', revenue: 'B2B' },
              { stream: 'ART Staking Fees', desc: 'Protocol fees from DEX trading redistributed to ART stakers', revenue: 'Token' },
            ].map(item => (
              <div key={item.stream} className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{item.stream}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-lg text-xs font-medium border border-yellow-500/20 flex-shrink-0 ml-4">{item.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'tokenomics':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[
              { label: 'Total Supply', value: '1,000,000,000 ART' },
              { label: 'Public Sale Price', value: '$0.20 per ART' },
              { label: 'TGE Date', value: 'Q3 2026' },
              { label: 'Airdrop Pool', value: '30M ART (3%)' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4">
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-base font-bold text-yellow-400">{stat.value}</p>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Ecosystem & Dev', pct: '20%' },
                { name: 'Team & Advisors', pct: '18%' },
                { name: 'Public Sale', pct: '15%' },
                { name: 'Marketing', pct: '12%' },
                { name: 'Private Sale', pct: '10%' },
                { name: 'Academy', pct: '10%' },
                { name: 'Reserve', pct: '10%' },
                { name: 'Community', pct: '5%' },
              ].map(item => (
                <div key={item.name} className="flex justify-between text-xs">
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-white font-medium">{item.pct}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case 'funding':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              { round: 'Angel Round', amount: '$500K', status: 'Closed' },
              { round: 'Private Sale', amount: '$2M', status: 'Closed' },
              { round: 'Grants', amount: '$500K', status: 'Received' },
            ].map(r => (
              <div key={r.round} className="bg-white/5 border border-yellow-500/20 rounded-xl p-4 text-center">
                <p className="text-lg font-black text-yellow-400">{r.amount}</p>
                <p className="text-sm text-white font-medium">{r.round}</p>
                <span className="text-xs text-green-400">✓ {r.status}</span>
              </div>
            ))}
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-3 font-medium uppercase tracking-wide">Use of Funds — $3M</p>
            {[
              { label: 'Team & Operations', pct: 30, amount: '$900K' },
              { label: 'Marketing & Community', pct: 25, amount: '$750K' },
              { label: 'Academy & Training', pct: 20, amount: '$600K' },
              { label: 'Token Launch & Listings', pct: 15, amount: '$450K' },
              { label: 'Infrastructure', pct: 10, amount: '$300K' },
            ].map(item => (
              <div key={item.label} className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{item.label}</span>
                  <span className="text-white">{item.amount} ({item.pct}%)</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full">
                  <div className="h-full bg-yellow-500 rounded-full" style={{ width: item.pct + '%' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'roadmap':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="space-y-3">
            {[
              { phase: 'Phase 1 — Foundation', period: 'Q1-Q2 2026', status: 'Completed', color: 'border-green-500/30 bg-green-500/5', items: ['Platform launch with 52+ features', '$3M raised across Angel + Private Sale + Grants'] },
              { phase: 'Phase 2 — TGE', period: 'Q3 2026', status: 'In Progress', color: 'border-yellow-500/30 bg-yellow-500/5', items: ['ART Token launch at $0.20', 'Airdrop to whitelist, CEX/DEX listings'] },
              { phase: 'Phase 3 — Mobile', period: 'Q4 2026', status: 'Upcoming', color: 'border-white/10 bg-white/5', items: ['iOS + Android app launch', 'Premium ART-gated features'] },
              { phase: 'Phase 4 — Ecosystem', period: '2027', status: 'Planned', color: 'border-white/10 bg-white/5', items: ['AureoTrack DEX launch', 'Governance + staking portal'] },
            ].map(phase => (
              <div key={phase.phase} className={"border rounded-xl px-5 py-3 " + phase.color}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-bold text-white">{phase.phase}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">{phase.period}</span>
                    <span className={"text-xs px-2 py-0.5 rounded-full " + (phase.status === 'Completed' ? 'bg-green-400/10 text-green-400' : phase.status === 'In Progress' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-white/10 text-gray-400')}>
                      {phase.status}
                    </span>
                  </div>
                </div>
                <div className="flex gap-4">
                  {phase.items.map((item, i) => (
                    <p key={i} className="text-xs text-gray-500">→ {item}</p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      );

    case 'team':
      return (
        <div className="px-8 py-6 h-full flex flex-col justify-center">
          <div className="flex flex-col sm:flex-row gap-8 items-center bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
              <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white mb-1">Glean Moore</h3>
              <p className="text-yellow-400 text-sm font-medium mb-3">Founder & CEO — AureoTrack</p>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Visionary founder with a mission to democratize access to professional trading tools for emerging market traders. Built AureoTrack from zero to a 52-feature platform with global reach across Asia and Africa.</p>
              <div className="flex gap-3 flex-wrap">
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">Platform Architecture</div>
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">Trading Education</div>
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">Community Building</div>
                <div className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">AI Integration</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'cta':
      return (
        <div className="flex flex-col items-center justify-center h-full text-center px-8">
          <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-20 h-20 rounded-2xl object-cover mb-6" />
          <h2 className="text-4xl font-black text-white mb-3">Invest in AureoTrack</h2>
          <p className="text-yellow-400 text-lg font-medium mb-4">The future of trading intelligence is here</p>
          <p className="text-gray-400 max-w-lg mb-8 text-sm leading-relaxed">Join us in democratizing access to professional trading tools for the next billion traders in emerging markets. ART public sale opens Q3 2026 at $0.20 per token.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg mb-8">
            {[
              { label: 'Public Sale Price', value: '$0.20' },
              { label: 'Total Raised', value: '$3M' },
              { label: 'TGE', value: 'Q3 2026' },
            ].map(stat => (
              <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-xl font-black text-yellow-400">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-4 flex-wrap justify-center">
            <button onClick={() => window.location.href = 'mailto:contact@aureotrack.com'} className="px-8 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors">
              Contact for Investment →
            </button>
            <button onClick={() => window.location.href = '/whitepaper'} className="px-8 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
              Read Whitepaper
            </button>
          </div>
          <p className="text-xs text-gray-600 mt-6">contact@aureotrack.com · aureotrack.com · @aureotrack</p>
        </div>
      );

    default:
      return null;
  }
}

export default function PitchDeck() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const goNext = () => setCurrentSlide(s => Math.min(s + 1, SLIDES.length - 1));
  const goPrev = () => setCurrentSlide(s => Math.max(s - 1, 0));

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
      <Nav active="" />

      <div className="flex-1 flex flex-col max-w-screen-xl mx-auto w-full px-4 py-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-bold text-white">AureoTrack Pitch Deck</h1>
            <p className="text-xs text-gray-500">Slide {currentSlide + 1} of {SLIDES.length}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.location.href = '/whitepaper'} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors">
              Whitepaper
            </button>
            <button onClick={() => window.location.href = '/tokenomics'} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors">
              Tokenomics
            </button>
            <button onClick={() => window.location.href = 'mailto:contact@aureotrack.com'} className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Contact →
            </button>
          </div>
        </div>

        <div className="flex gap-1 mb-4 overflow-x-auto pb-2">
          {SLIDES.map((s, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={"flex-shrink-0 px-3 py-1.5 rounded-lg text-xs transition-colors " + (i === currentSlide ? 'bg-yellow-500 text-black font-semibold' : 'bg-white/5 text-gray-500 hover:text-white hover:bg-white/10')}
            >
              {i + 1}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-[#111111] border border-white/10 rounded-2xl overflow-hidden" style={{ minHeight: '500px' }}>
          <div className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="font-bold text-white">{slide.title}</h2>
              <p className="text-xs text-gray-500">{slide.subtitle}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/50" />
            </div>
          </div>
          <div style={{ minHeight: '460px' }}>
            <SlideContent type={slide.type} />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <button
            onClick={goPrev}
            disabled={currentSlide === 0}
            className="px-6 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            ← Previous
          </button>
          <p className="text-xs text-gray-600">{slide.title}</p>
          <button
            onClick={goNext}
            disabled={currentSlide === SLIDES.length - 1}
            className="px-6 py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-30"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}