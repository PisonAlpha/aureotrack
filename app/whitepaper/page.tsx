'use client';

import { useState } from 'react';
import Nav from '../components/Nav';

const SECTIONS = [
  { id: 'abstract', title: 'Abstract' },
  { id: 'introduction', title: '1. Introduction' },
  { id: 'problem', title: '2. Problem Statement' },
  { id: 'solution', title: '3. The Solution' },
  { id: 'products', title: '4. Product Suite' },
  { id: 'technology', title: '5. Technology' },
  { id: 'token', title: '6. ART Token Utility' },
  { id: 'tokenomics', title: '7. Tokenomics' },
  { id: 'roadmap', title: '8. Roadmap' },
  { id: 'team', title: '9. Team' },
  { id: 'market', title: '10. Market Opportunity' },
  { id: 'legal', title: '11. Legal Disclaimer' },
];

function PaperCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-3xl p-8 ${className}`} style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
      boxShadow: '0 25px 60px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.8) inset, 0 -1px 0 rgba(0,0,0,0.1) inset',
      color: '#1a1a2e',
    }}>
      {children}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-black mb-6 pb-3 flex items-center gap-3" style={{
      color: '#1a1a2e',
      borderBottom: '2px solid #f59e0b',
    }}>
      {children}
    </h2>
  );
}

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState('abstract');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }}>
      <Nav active="" />

      {/* Hero */}
      <div className="relative overflow-hidden py-16 px-4 text-center border-b border-white/10">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, #f59e0b33 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-6 uppercase tracking-widest">
            📄 Official Whitepaper — Version 1.0 — 2026
          </div>
          <h1 className="text-5xl font-black text-white mb-3 tracking-tight">AureoTrack <span className="text-yellow-400">Whitepaper</span></h1>
          <p className="text-gray-400 mb-6">Founded 2025 · Version 1.0 · contact@aureotrack.com · aureotrack.com</p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => window.location.href = '/tokenomics'} className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">View Tokenomics →</button>
            <button onClick={() => window.location.href = '/pitch-deck'} className="px-5 py-2.5 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">Pitch Deck</button>
            <button onClick={() => window.location.href = '/airdrop'} className="px-5 py-2.5 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">Join Airdrop</button>
          </div>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-10 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 flex-shrink-0">
          <div className="sticky top-24 rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(145deg, #1a1a2e, #16213e)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-yellow-400 uppercase tracking-widest font-bold">Contents</p>
            </div>
            <nav className="p-3 space-y-0.5">
              {SECTIONS.map(section => (
                <button key={section.id} onClick={() => scrollTo(section.id)}
                  className={"w-full text-left px-3 py-2 rounded-xl text-xs transition-all " + (activeSection === section.id ? 'bg-yellow-500/20 text-yellow-400 font-semibold' : 'text-gray-500 hover:text-white hover:bg-white/5')}>
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl space-y-8">

          <section id="abstract" className="scroll-mt-24">
            <PaperCard>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>📄</div>
                <h2 className="text-2xl font-black" style={{ color: '#1a1a2e' }}>Abstract</h2>
              </div>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#374151' }}>
                <p>AureoTrack is a next-generation macro and crypto trading intelligence platform that democratizes access to professional-grade financial tools, real-time market data, and world-class trading education for retail traders globally.</p>
                <p>The platform combines five integrated product pillars — AureoTrack Intelligence, AureoTrade, AureoAcademy, AureoAI, and AureoCommunity — into a unified ecosystem powered by artificial intelligence and blockchain technology.</p>
                <p>The AureoTrack Token (ART) serves as the native utility token of the ecosystem, with a total supply of <strong>1,000,000,000 ART</strong>, a public sale price of <strong>$0.20</strong>, and a target TGE date of <strong>Q3 2026</strong>. Only 12% of total supply (120M ART) will circulate at TGE, with the remaining supply subject to vesting schedules designed to ensure long-term ecosystem health. Treasury tokens (20%) are locked for 3 full years.</p>
              </div>
            </PaperCard>
          </section>

          <section id="introduction" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>1. Introduction</SectionTitle>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#374151' }}>
                <p>The global financial markets have historically been dominated by institutional players with access to sophisticated tools, real-time data feeds, and professional research. Retail traders — particularly those in emerging markets across Africa and Asia — have been left behind, trading with inferior tools and incomplete information.</p>
                <p>AureoTrack was founded in <strong>2025</strong> by Glean Moore with a singular mission: to level the playing field. By combining cutting-edge artificial intelligence, real-time market data aggregation, and a comprehensive educational ecosystem, AureoTrack provides retail traders with the same quality of intelligence that institutional traders have relied upon for decades.</p>
                <p>Since launch, AureoTrack has built a platform with <strong>58+ features</strong> across five product areas, established chapter communities in Asia and Africa, raised <strong>$3,000,000</strong> across Angel Round, Private Sale, and Grants, and is preparing for its Token Generation Event in Q3 2026.</p>
              </div>
            </PaperCard>
          </section>

          <section id="problem" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>2. Problem Statement</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '🚫', title: 'Information Asymmetry', desc: 'Retail traders lack access to the real-time intelligence and macro analysis that institutional traders use daily.' },
                  { icon: '💸', title: 'Expensive Tools', desc: 'Bloomberg Terminal costs $24,000+/year — completely unaffordable for most retail traders globally.' },
                  { icon: '📚', title: 'Poor Education', desc: 'Most trading education is low quality, overpriced, or taught by unqualified instructors with no real experience.' },
                  { icon: '🌍', title: 'Geographic Exclusion', desc: 'Traders in Africa and Asia are systematically excluded from the best platforms by geo-restrictions and pricing.' },
                  { icon: '⚡', title: 'Fragmented Tools', desc: 'Traders use 5-10 different apps for charts, news, analysis, education, and community — creating friction.' },
                  { icon: '🎰', title: '80%+ Failure Rate', desc: 'Most retail traders lose money due to insufficient education, poor tools, and no risk management systems.' },
                ].map(p => (
                  <div key={p.title} className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #f8f9ff, #eef0ff)', border: '1px solid #e8eaf0' }}>
                    <span className="text-xl mb-2 block">{p.icon}</span>
                    <p className="font-bold text-sm mb-1" style={{ color: '#1a1a2e' }}>{p.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{p.desc}</p>
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

          <section id="solution" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>3. The AureoTrack Solution</SectionTitle>
              <div className="rounded-2xl p-5 mb-5" style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '1px solid #fde68a' }}>
                <p className="font-black text-lg mb-2" style={{ color: '#92400e' }}>One platform. Everything a trader needs.</p>
                <p className="text-sm leading-relaxed" style={{ color: '#78350f' }}>AureoTrack solves these problems through a unified, AI-powered trading intelligence platform that brings together real-time market data, AI analysis, professional demo trading, world-class education, and a global community — all in one place.</p>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {[
                  '✓ Real-time data from 40+ assets across crypto, forex, and commodities',
                  '✓ AI-powered market analysis with bull/neutral/bear probability forecasts',
                  '✓ TradingView-quality live charts with full technical analysis toolkit',
                  '✓ Arbitrage scanner across 9 CEX and DEX sources simultaneously',
                  '✓ 60+ AI-generated trading lessons with quizzes and certifications',
                  '✓ Live online training programs ($149–$299) taught by experienced traders',
                  '✓ Multi-chain portfolio tracking across 5 blockchain networks',
                  '✓ Global community with chapter presence in Asia and Africa',
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-2.5 rounded-xl text-sm" style={{ background: i % 2 === 0 ? '#f8f9ff' : '#f0f4ff', color: '#374151' }}>
                    <span className="font-bold" style={{ color: '#f59e0b' }}>→</span>{point.replace('✓ ', '')}
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

          <section id="products" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>4. Product Suite</SectionTitle>
              <div className="space-y-4">
                {[
                  { icon: '📊', name: 'AureoTrack Intelligence', color: '#3b82f6', desc: 'Real-time prices across 40+ assets, BTC/Gold correlation analysis, live news feed from 200+ sources, and an exchange arbitrage scanner across 9 major venues including major CEXes and DEXes.', features: ['40+ asset prices (crypto, forex, gold)', 'BTC/Gold normalized correlation chart (XAUT)', 'Arbitrage scanner — 9 CEX + DEX', 'Live news (crypto + global economy)'] },
                  { icon: '📈', name: 'AureoTrade', color: '#10b981', desc: 'Professional-grade demo trading terminal with TradingView live charts, 22 tradable pairs, spot and futures trading with up to 20x leverage, and a competitive leaderboard with trading challenges.', features: ['TradingView live charts', '22 trading pairs (18 crypto + Gold + forex)', 'Spot + Futures with up to 20x leverage', 'Challenges + Leaderboard'] },
                  { icon: '🎓', name: 'AureoAcademy', color: '#f59e0b', desc: 'Comprehensive trading education with 6 specialized schools, 60+ AI-generated lessons, intelligent quiz system, certification issuance, live online training cohorts, and an AI Mentor for personalized learning paths.', features: ['6 schools: Beginner, Forex, Crypto, TA, Risk, Psychology', '60+ AI lessons with quizzes', 'Live training programs ($149–$299)', 'Certifications + AI Mentor'] },
                  { icon: '🤖', name: 'AureoAI', color: '#8b5cf6', desc: 'AI intelligence layer powered by Claude Sonnet providing asset-specific market analysis, event impact simulation for macro scenarios, personalized AI mentor, and a site-wide AI assistant on every page.', features: ['Market analysis with probability forecasts', 'Event impact simulator', 'Personalized AI learning mentor', 'Site-wide AI assistant'] },
                  { icon: '🌐', name: 'AureoCommunity', color: '#ec4899', desc: 'Global trading community with discussion rooms, competitive leaderboard, trading challenges, global chapter presence in Asia and Africa, and the ART token airdrop whitelist for challenge participants.', features: ['Discussion rooms by market type', 'Leaderboard + Trading challenges', 'Global chapters (Asia + Africa)', 'TGE airdrop whitelist'] },
                ].map(product => (
                  <div key={product.name} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${product.color}22` }}>
                    <div className="px-5 py-3 flex items-center gap-3" style={{ background: `${product.color}12` }}>
                      <span className="text-xl">{product.icon}</span>
                      <h3 className="font-black text-base" style={{ color: product.color }}>{product.name}</h3>
                    </div>
                    <div className="px-5 py-4" style={{ background: '#f8f9ff' }}>
                      <p className="text-sm leading-relaxed mb-3" style={{ color: '#374151' }}>{product.desc}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {product.features.map((f, i) => (
                          <p key={i} className="text-xs flex items-start gap-1.5" style={{ color: '#6b7280' }}>
                            <span style={{ color: product.color }}>→</span>{f}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

          <section id="technology" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>5. Technology Stack</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { cat: 'Frontend', color: '#3b82f6', items: ['Next.js 16 (React)', 'TypeScript', 'Tailwind CSS', 'Recharts', 'TradingView Widget'] },
                  { cat: 'Backend & Database', color: '#10b981', items: ['Next.js API Routes', 'Supabase (PostgreSQL)', 'Vercel Edge', 'bcryptjs', 'JWT Auth'] },
                  { cat: 'AI & Intelligence', color: '#8b5cf6', items: ['Claude Sonnet 4.6', 'AI Market Analysis', 'Event Simulator', 'AI Mentor', 'AI Lesson Generator'] },
                  { cat: 'Market Data', color: '#f59e0b', items: ['Binance API (crypto)', 'CoinGecko (XAUT gold)', 'DexScreener (DEX)', 'Frankfurter (forex)', 'TradingView charts'] },
                  { cat: 'Email & Comms', color: '#ec4899', items: ['Resend API', 'contact@aureotrack.com', 'Email verification', 'Password reset', 'Training enrollment'] },
                  { cat: 'Blockchain', color: '#f97316', items: ['ethers.js (EVM)', 'Solana Web3.js', 'MetaMask connect', 'Multi-chain portfolio', 'Airdrop whitelist'] },
                ].map(stack => (
                  <div key={stack.cat} className="rounded-xl p-4" style={{ background: `${stack.color}08`, border: `1px solid ${stack.color}22` }}>
                    <p className="font-bold text-sm mb-2" style={{ color: stack.color }}>{stack.cat}</p>
                    <ul className="space-y-1">
                      {stack.items.map((item, i) => (
                        <li key={i} className="text-xs flex items-center gap-2" style={{ color: '#6b7280' }}>
                          <span style={{ color: stack.color }}>·</span>{item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

          <section id="token" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>6. ART Token Utility</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon: '🔓', title: 'Premium Access', desc: 'ART holders unlock premium features including advanced AI signals, priority data feeds, and exclusive trading tools.' },
                  { icon: '🗳️', title: 'Governance', desc: 'ART holders vote on platform development, feature roadmap, and Treasury allocation post Year 3 lock.' },
                  { icon: '💎', title: 'Staking Rewards', desc: 'Stake ART to earn a share of platform revenue, distributed proportionally to all active stakers.' },
                  { icon: '🎓', title: 'Education Credits', desc: 'Pay for live training programs using ART at a 20% discount versus standard fiat pricing.' },
                  { icon: '🏆', title: 'Community Rewards', desc: 'Earn ART by completing trading challenges, passing academy certifications, and contributing to community.' },
                  { icon: '⚡', title: 'DEX Fee Discount', desc: 'Pay trading fees on the upcoming AureoTrack DEX using ART for a 50% discount on all transactions.' },
                ].map(u => (
                  <div key={u.title} className="rounded-xl p-4" style={{ background: 'linear-gradient(135deg, #f8f9ff, #eef0ff)', border: '1px solid #e8eaf0' }}>
                    <span className="text-xl mb-2 block">{u.icon}</span>
                    <p className="font-bold text-sm mb-1" style={{ color: '#1a1a2e' }}>{u.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{u.desc}</p>
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

          <section id="tokenomics" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>7. Tokenomics Summary</SectionTitle>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                {[
                  { label: 'Total Supply', value: '1B ART' },
                  { label: 'Initial Circulating', value: '12%' },
                  { label: 'Public Price', value: '$0.20' },
                  { label: 'TGE', value: 'Q3 2026' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-4 text-center" style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '1px solid #fde68a' }}>
                    <p className="font-black text-lg" style={{ color: '#92400e' }}>{s.value}</p>
                    <p className="text-xs mt-1" style={{ color: '#78350f' }}>{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-2 text-sm" style={{ color: '#374151' }}>
                <p>→ <strong>Angel Round:</strong> $700,000 raised at $0.15/ART — Q1 2025 — CLOSED</p>
                <p>→ <strong>Private Sale:</strong> $2,000,000 raised at $0.18/ART — Q2 2026 — CLOSED</p>
                <p>→ <strong>Grants:</strong> $300,000 non-dilutive — Q2 2026 — RECEIVED</p>
                <p>→ <strong>Public Sale:</strong> $30M target at $0.20/ART — Q3 2026 — UPCOMING</p>
                <p>→ <strong>Team tokens</strong> locked for 1 full year then vest over 24 months</p>
                <p>→ <strong>Treasury (20%)</strong> locked for 3 full years, then DAO governed</p>
              </div>
              <button onClick={() => window.location.href = '/tokenomics'} className="mt-5 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245,158,11,0.3)' }}>
                View Full Tokenomics →
              </button>
            </PaperCard>
          </section>

          <section id="roadmap" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>8. Roadmap</SectionTitle>
              <div className="space-y-3">
                {[
                  { phase: 'Phase 1', period: 'Q1 2025 — Q2 2026', status: 'Completed', color: '#10b981', bg: '#f0fdf4', border: '#bbf7d0', items: ['AureoTrack founded Q1 2025', 'Platform launch with 58+ features', 'AureoAcademy — 6 schools, 60+ lessons', 'Angel Round ($700K at $0.15) + Private Sale ($2M at $0.18) + Grants ($300K) = $3M raised', 'Global chapters — Asia & Africa'] },
                  { phase: 'Phase 2', period: 'Q3 2026', status: 'In Progress', color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', items: ['ART Token Generation Event (TGE)', 'Public sale at $0.20 per ART', '12% initial circulating supply', 'Airdrop to 30M ART whitelist', 'CEX + DEX exchange listings'] },
                  { phase: 'Phase 3', period: 'Q4 2026', status: 'Upcoming', color: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe', items: ['iOS + Android mobile app', 'ART-gated premium subscription tier', 'Exchange revenue sharing partnerships', 'Advanced AI signals and alerts'] },
                  { phase: 'Phase 4', period: '2027+', status: 'Planned', color: '#8b5cf6', bg: '#f5f3ff', border: '#ddd6fe', items: ['AureoTrack DEX launch', 'Governance + staking portal', 'Treasury unlock (Year 3 — DAO governed)', 'Global expansion — 10+ countries, 10 languages'] },
                ].map(phase => (
                  <div key={phase.phase} className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${phase.border}` }}>
                    <div className="px-5 py-3 flex items-center justify-between" style={{ background: phase.bg }}>
                      <div>
                        <span className="font-black text-sm" style={{ color: phase.color }}>{phase.phase}</span>
                        <span className="text-xs ml-2" style={{ color: '#6b7280' }}>{phase.period}</span>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: `${phase.color}20`, color: phase.color }}>{phase.status}</span>
                    </div>
                    <div className="px-5 py-3" style={{ background: phase.bg + 'aa' }}>
                      <ul className="space-y-1">
                        {phase.items.map((item, i) => (
                          <li key={i} className="text-xs flex items-start gap-2" style={{ color: '#374151' }}>
                            <span style={{ color: phase.color }}>→</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </PaperCard>
          </section>

          <section id="team" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>9. Team</SectionTitle>
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }}>
                  <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Founder & CEO</p>
                  <h3 className="text-xl font-black mb-2" style={{ color: '#1a1a2e' }}>Glean Moore</h3>
                  <p className="text-sm leading-relaxed mb-3" style={{ color: '#374151' }}>Visionary founder of AureoTrack since 2025. Built AureoTrack from the ground up into a 58-feature trading intelligence platform serving retail traders across Asia and Africa. Passionate about democratizing access to professional financial tools for the next generation of global traders.</p>
                  <a href="https://x.com/aureotrack" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all" style={{ background: '#1a1a2e' }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    @aureotrack
                  </a>
                </div>
              </div>
            </PaperCard>
          </section>

          <section id="market" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>10. Market Opportunity</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[
                  { value: '$3.2T+', label: 'Daily Forex Volume', sub: 'Global market' },
                  { value: '425M+', label: 'Crypto Users', sub: '+15% YoY' },
                  { value: '$12.7B', label: 'EdFintech Market', sub: 'By 2028' },
                ].map(stat => (
                  <div key={stat.label} className="rounded-2xl p-5 text-center" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                    <p className="text-2xl font-black text-yellow-400 mb-1">{stat.value}</p>
                    <p className="text-xs text-white font-medium">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.sub}</p>
                  </div>
                ))}
              </div>
              <div className="space-y-3 text-sm leading-relaxed" style={{ color: '#374151' }}>
                <p>AureoTrack targets the underserved retail trader segment in <strong>Africa and Asia</strong> — two of the world's fastest-growing trading markets with hundreds of millions of potential users seeking affordable, professional-grade tools and education.</p>
                <p>With a freemium model at the base level and ART-gated premium features, AureoTrack is positioned to capture users at every income level while building a sustainable token economy through staking, governance, and DEX fees.</p>
              </div>
            </PaperCard>
          </section>

          <section id="legal" className="scroll-mt-24">
            <PaperCard>
              <SectionTitle>11. Legal Disclaimer</SectionTitle>
              <div className="space-y-3 text-xs leading-relaxed" style={{ color: '#6b7280' }}>
                <p>This whitepaper has been prepared for informational purposes only and does not constitute financial advice, investment advice, or an offer to sell or solicitation to buy any securities or financial instruments in any jurisdiction.</p>
                <p>The ART token is a utility token designed to power the AureoTrack ecosystem. It is not intended to constitute a security, investment product, or financial instrument. Prospective participants should carefully review applicable laws and regulations in their jurisdiction before participating in any token sale or airdrop.</p>
                <p>All information contained in this whitepaper is subject to change without notice. AureoTrack makes no representations or warranties about the completeness, accuracy, or reliability of any information herein. Cryptocurrency and token investments carry significant risk. Never invest more than you can afford to lose.</p>
                <p className="font-semibold" style={{ color: '#374151' }}>AureoTrack © 2025–2026 · contact@aureotrack.com · aureotrack.com · @aureotrack · t.me/aureo_track</p>
              </div>
            </PaperCard>
          </section>

        </div>
      </div>
    </div>
  );
}