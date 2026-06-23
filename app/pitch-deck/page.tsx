'use client';

import { useState } from 'react';
import Nav from '../components/Nav';

const SLIDES = [
  { id: 1, label: 'Cover', type: 'cover' },
  { id: 2, label: 'Problem', type: 'problem' },
  { id: 3, label: 'Solution', type: 'solution' },
  { id: 4, label: 'Products', type: 'products' },
  { id: 5, label: 'Market', type: 'market' },
  { id: 6, label: 'Traction', type: 'traction' },
  { id: 7, label: 'Business Model', type: 'business' },
  { id: 8, label: 'Tokenomics', type: 'tokenomics' },
  { id: 9, label: 'Funding', type: 'funding' },
  { id: 10, label: 'Roadmap', type: 'roadmap' },
  { id: 11, label: 'Team', type: 'team' },
  { id: 12, label: 'Invest', type: 'cta' },
];

function PaperSlide({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`w-full h-full flex flex-col ${className}`} style={{
      background: 'linear-gradient(145deg, #ffffff 0%, #f8f9ff 100%)',
      color: '#1a1a2e',
      padding: '0',
    }}>
      {children}
    </div>
  );
}

function SlideTitle({ children, accent }: { children: React.ReactNode; accent?: string }) {
  return (
    <h2 className="text-2xl font-black mb-6" style={{ color: '#1a1a2e' }}>
      {children}{accent && <span style={{ color: '#f59e0b' }}> {accent}</span>}
    </h2>
  );
}

function Tag({ children, color = '#f59e0b' }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="inline-flex px-3 py-1 rounded-full text-xs font-bold" style={{ background: `${color}18`, color, border: `1px solid ${color}33` }}>
      {children}
    </span>
  );
}

function SlideContent({ type }: { type: string }) {
  switch (type) {
    case 'cover':
      return (
        <PaperSlide>
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10 py-8" style={{ background: 'linear-gradient(145deg, #0a0a1a, #111827)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 50% 30%, #f59e0b 0%, transparent 60%)' }} />
            <div className="relative">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-20 h-20 rounded-2xl mx-auto mb-6 object-cover" style={{ boxShadow: '0 0 40px rgba(245,158,11,0.3)' }} />
              <h1 className="text-5xl font-black text-white mb-3 tracking-tight">AureoTrack</h1>
              <p className="text-xl font-medium mb-2" style={{ color: '#f59e0b' }}>Macro & Trading Intelligence Platform</p>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-8">Democratizing professional trading tools, AI-powered intelligence, and world-class education for the next generation of global traders.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                {[['Founded 2025', '#f59e0b'], ['$3M Raised', '#10b981'], ['58+ Features', '#3b82f6'], ['Q3 2026 TGE', '#8b5cf6']].map(([label, color]) => (
                  <Tag key={label} color={color}>{label}</Tag>
                ))}
              </div>
              <p className="text-gray-600 text-xs mt-8">contact@aureotrack.com · aureotrack.com · @aureotrack</p>
            </div>
          </div>
        </PaperSlide>
      );

    case 'problem':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="Statement">The Problem</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 grid grid-cols-2 gap-3 content-start">
            {[
              { icon: '🚫', title: 'Information Asymmetry', desc: 'Retail traders lack real-time intelligence that institutional traders use daily', color: '#ef4444' },
              { icon: '💸', title: 'Unaffordable Tools', desc: 'Bloomberg Terminal costs $24,000+/year — impossible for most retail traders', color: '#f97316' },
              { icon: '📚', title: 'Poor Education', desc: 'Low-quality, overpriced courses taught by unqualified instructors', color: '#f59e0b' },
              { icon: '🌍', title: 'Geographic Exclusion', desc: 'Africa & Asia traders excluded from best platforms by geo-restrictions', color: '#8b5cf6' },
              { icon: '⚡', title: 'Fragmented Tools', desc: 'Traders need 5–10 apps for charts, news, education, community', color: '#3b82f6' },
              { icon: '📉', title: '80%+ Failure Rate', desc: 'Most retail traders lose money due to lack of education and tools', color: '#6b7280' },
            ].map(p => (
              <div key={p.title} className="rounded-xl p-4" style={{ background: `${p.color}08`, border: `1px solid ${p.color}22` }}>
                <span className="text-xl mb-2 block">{p.icon}</span>
                <p className="font-bold text-xs mb-1" style={{ color: '#1a1a2e' }}>{p.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: '#6b7280' }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </PaperSlide>
      );

    case 'solution':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="Solution">The AureoTrack</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-4">
            <div className="rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '2px solid #fde68a' }}>
              <p className="font-black text-lg mb-1" style={{ color: '#92400e' }}>One platform. Everything a trader needs.</p>
              <p className="text-sm" style={{ color: '#78350f' }}>Real-time market data + AI analysis + demo trading + world-class education + global community — free to use.</p>
            </div>
            <div className="grid grid-cols-2 gap-2 flex-1">
              {[
                'Real-time data — 40+ assets (crypto, forex, gold)',
                'AI analysis with bull/neutral/bear probability forecasts',
                'TradingView live charts — 22 tradable pairs',
                'Arbitrage scanner — 9 CEX + DEX sources',
                '60+ AI trading lessons with certifications',
                'Multi-chain portfolio tracking — 5 blockchains',
                'Live online training programs ($149–$299)',
                'Global community — Asia + Africa chapters',
              ].map((point, i) => (
                <div key={i} className="flex items-start gap-2 px-3 py-2.5 rounded-xl text-xs" style={{ background: i % 2 === 0 ? '#f8f9ff' : '#eef0ff', color: '#374151' }}>
                  <span className="font-bold flex-shrink-0" style={{ color: '#f59e0b' }}>✓</span>{point}
                </div>
              ))}
            </div>
          </div>
        </PaperSlide>
      );

    case 'products':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="Suite">5-Product</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-2.5">
            {[
              { icon: '📊', name: 'AureoTrack Intelligence', desc: 'Real-time prices, BTC/Gold chart, arbitrage scanner, live news', color: '#3b82f6' },
              { icon: '📈', name: 'AureoTrade', desc: 'Demo terminal with TradingView charts, 22 pairs, spot + futures 20x', color: '#10b981' },
              { icon: '🎓', name: 'AureoAcademy', desc: '6 schools, 60+ AI lessons, certifications, live training cohorts', color: '#f59e0b' },
              { icon: '🤖', name: 'AureoAI', desc: 'Market analysis, event simulator, AI mentor, site-wide assistant', color: '#8b5cf6' },
              { icon: '🌐', name: 'AureoCommunity', desc: 'Discussion rooms, leaderboard, challenges, airdrop whitelist', color: '#ec4899' },
            ].map(p => (
              <div key={p.name} className="flex items-center gap-4 rounded-xl px-4 py-3" style={{ background: `${p.color}08`, border: `1px solid ${p.color}22` }}>
                <span className="text-2xl flex-shrink-0">{p.icon}</span>
                <div className="flex-1">
                  <p className="font-black text-sm" style={{ color: p.color }}>{p.name}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </PaperSlide>
      );

    case 'market':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="Opportunity">Market</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { value: '$3.2T+', label: 'Daily Forex Volume', color: '#f59e0b' },
                { value: '425M+', label: 'Global Crypto Users', color: '#3b82f6' },
                { value: '$12.7B', label: 'EdFintech by 2028', color: '#10b981' },
              ].map(s => (
                <div key={s.label} className="rounded-2xl p-4 text-center" style={{ background: 'linear-gradient(145deg, #0a0a1a, #111827)', boxShadow: '0 8px 20px rgba(0,0,0,0.3)' }}>
                  <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex-1 rounded-2xl p-5" style={{ background: 'linear-gradient(135deg, #f8f9ff, #eef0ff)', border: '1px solid #e8eaf0' }}>
              <p className="font-black text-base mb-3" style={{ color: '#1a1a2e' }}>Why AureoTrack Wins</p>
              {[
                'Africa + Asia — fastest growing retail trading markets, most underserved',
                'Freemium model removes barrier to entry, ART token drives monetization',
                'AI-first approach gives retail traders institutional-quality intelligence',
                'Education + tools + community — full lifecycle platform for every trader',
              ].map((p, i) => (
                <p key={i} className="text-xs mb-2 flex items-start gap-2" style={{ color: '#374151' }}>
                  <span style={{ color: '#f59e0b' }}>→</span>{p}
                </p>
              ))}
            </div>
          </div>
        </PaperSlide>
      );

    case 'traction':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="& Milestones">Traction</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 grid grid-cols-3 gap-3 content-start">
            {[
              { value: '58+', label: 'Platform Features', icon: '⚡', color: '#f59e0b' },
              { value: '60+', label: 'Academy Lessons', icon: '📚', color: '#3b82f6' },
              { value: '6', label: 'Trading Schools', icon: '🎓', color: '#10b981' },
              { value: '22', label: 'Trading Pairs', icon: '📈', color: '#8b5cf6' },
              { value: '9', label: 'Exchange Sources', icon: '🔍', color: '#ec4899' },
              { value: '5', label: 'Blockchain Networks', icon: '🌐', color: '#f97316' },
              { value: '$3M', label: 'Total Raised', icon: '💰', color: '#10b981' },
              { value: '2', label: 'Global Chapters', icon: '🌍', color: '#3b82f6' },
              { value: 'Q3 2026', label: 'TGE Date', icon: '🪙', color: '#f59e0b' },
            ].map(stat => (
              <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: `${stat.color}08`, border: `1px solid ${stat.color}22` }}>
                <span className="text-xl mb-1 block">{stat.icon}</span>
                <p className="text-xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-xs mt-1" style={{ color: '#6b7280' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </PaperSlide>
      );

    case 'business':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="Model">Business</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-2.5">
            {[
              { stream: 'ART Token Public Sale', desc: '$0.20/ART — $30M target at TGE', type: 'Primary', color: '#f59e0b' },
              { stream: 'Premium Subscriptions', desc: 'ART-gated pro tier with advanced AI signals and tools', type: 'Recurring', color: '#10b981' },
              { stream: 'Live Training Programs', desc: '$149–$299 per cohort — quarterly intake', type: 'Recurring', color: '#3b82f6' },
              { stream: 'Exchange Partnerships', desc: 'Revenue sharing on referrals via arbitrage scanner', type: 'Passive', color: '#8b5cf6' },
              { stream: 'API & White-label', desc: 'Institutional API access and white-label licensing', type: 'B2B', color: '#ec4899' },
              { stream: 'AureoTrack DEX (2027)', desc: 'Protocol fees from DEX trading — ART staker rewards', type: 'Token', color: '#f97316' },
            ].map(item => (
              <div key={item.stream} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: `${item.color}06`, border: `1px solid ${item.color}20` }}>
                <div>
                  <p className="font-bold text-sm" style={{ color: '#1a1a2e' }}>{item.stream}</p>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{item.desc}</p>
                </div>
                <Tag color={item.color}>{item.type}</Tag>
              </div>
            ))}
          </div>
        </PaperSlide>
      );

    case 'tokenomics':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="(ART)">Tokenomics</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Total Supply', value: '1,000,000,000 ART', color: '#f59e0b' },
                { label: 'Initial Circulating', value: '12% — 120M ART', color: '#3b82f6' },
                { label: 'Public Sale Price', value: '$0.20 per ART', color: '#10b981' },
                { label: 'TGE Date', value: 'Q3 2026', color: '#8b5cf6' },
              ].map(s => (
                <div key={s.label} className="rounded-xl p-3" style={{ background: `${s.color}08`, border: `1px solid ${s.color}22` }}>
                  <p className="text-xs" style={{ color: '#6b7280' }}>{s.label}</p>
                  <p className="font-black text-sm mt-0.5" style={{ color: s.color }}>{s.value}</p>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 flex-1" style={{ background: 'linear-gradient(135deg, #f8f9ff, #eef0ff)', border: '1px solid #e8eaf0' }}>
              <p className="font-bold text-xs mb-2" style={{ color: '#6b7280' }}>ALLOCATION BREAKDOWN</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                {[
                  ['Community & Airdrop', '12%', '#f59e0b'],
                  ['Public Sale', '15%', '#3b82f6'],
                  ['Private Sale', '10%', '#8b5cf6'],
                  ['Angel Round', '5%', '#ec4899'],
                  ['Team & Advisors*', '18%', '#f97316'],
                  ['Ecosystem & Dev', '10%', '#10b981'],
                  ['Marketing', '10%', '#06b6d4'],
                  ['Treasury**', '20%', '#6b7280'],
                ].map(([name, pct, color]) => (
                  <div key={name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                      <span style={{ color: '#374151' }}>{name}</span>
                    </div>
                    <span className="font-black" style={{ color }}>{pct}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-3" style={{ color: '#9ca3af' }}>* Team locked 1 year · ** Treasury locked 3 years (DAO governed after)</p>
            </div>
          </div>
        </PaperSlide>
      );

    case 'funding':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="& Use of Funds">Funding</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-4">
            <div className="grid grid-cols-3 gap-3">
              {[
                { round: 'Angel Round', amount: '$700K', detail: '$0.15/ART · Q1 2025', color: '#f59e0b', bg: '#fefce8' },
                { round: 'Private Sale', amount: '$2M', detail: '$0.18/ART · Q2 2026', color: '#8b5cf6', bg: '#f5f3ff' },
                { round: 'Grants', amount: '$300K', detail: 'Non-dilutive · Q2 2026', color: '#3b82f6', bg: '#eff6ff' },
              ].map(r => (
                <div key={r.round} className="rounded-xl p-4 text-center" style={{ background: r.bg, border: `1px solid ${r.color}33` }}>
                  <p className="text-xs font-semibold mb-1" style={{ color: '#6b7280' }}>{r.round}</p>
                  <p className="text-2xl font-black" style={{ color: r.color }}>{r.amount}</p>
                  <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>{r.detail}</p>
                  <span className="text-xs font-bold" style={{ color: '#10b981' }}>✓ Closed</span>
                </div>
              ))}
            </div>
            <div className="rounded-xl p-4 flex-1" style={{ background: 'linear-gradient(135deg, #f8f9ff, #eef0ff)', border: '1px solid #e8eaf0' }}>
              <p className="font-bold text-xs mb-3" style={{ color: '#6b7280' }}>USE OF FUNDS — $3,000,000</p>
              {[
                { label: 'Team & Operations', pct: 30, amount: '$900K', color: '#f97316' },
                { label: 'Marketing & Community', pct: 25, amount: '$750K', color: '#8b5cf6' },
                { label: 'Academy & Training', pct: 20, amount: '$600K', color: '#06b6d4' },
                { label: 'Token Launch & Listings', pct: 15, amount: '$450K', color: '#10b981' },
                { label: 'Infrastructure', pct: 10, amount: '$300K', color: '#f59e0b' },
              ].map(item => (
                <div key={item.label} className="mb-2">
                  <div className="flex justify-between text-xs mb-1">
                    <span style={{ color: '#374151' }}>{item.label}</span>
                    <span className="font-bold" style={{ color: item.color }}>{item.amount} ({item.pct}%)</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
                    <div className="h-full rounded-full" style={{ width: item.pct + '%', background: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PaperSlide>
      );

    case 'roadmap':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="to Scale">Path</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-3">
            {[
              { phase: 'Phase 1', period: 'Q1 2025 – Q2 2026', status: 'Completed', color: '#10b981', bg: '#f0fdf4', items: ['AureoTrack founded 2025 · 58+ features launched', '$3M raised (Angel $700K + Private $2M + Grants $300K)', 'AureoAcademy · Asia + Africa chapters established'] },
              { phase: 'Phase 2', period: 'Q3 2026', status: 'In Progress', color: '#f59e0b', bg: '#fffbeb', items: ['ART TGE — 12% initial supply · Public sale at $0.20', '30M ART airdrop distribution · CEX + DEX listings'] },
              { phase: 'Phase 3', period: 'Q4 2026', status: 'Upcoming', color: '#3b82f6', bg: '#eff6ff', items: ['iOS + Android mobile app · ART premium tier launch', 'Exchange revenue partnerships · AI signal alerts'] },
              { phase: 'Phase 4', period: '2027+', status: 'Planned', color: '#8b5cf6', bg: '#f5f3ff', items: ['AureoTrack DEX · Governance portal · Treasury DAO unlock', 'Global expansion — 10+ countries · 100K+ users'] },
            ].map(phase => (
              <div key={phase.phase} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${phase.color}30` }}>
                <div className="px-4 py-2 flex items-center justify-between" style={{ background: phase.bg }}>
                  <div>
                    <span className="font-black text-xs" style={{ color: phase.color }}>{phase.phase}</span>
                    <span className="text-xs ml-2" style={{ color: '#9ca3af' }}>{phase.period}</span>
                  </div>
                  <Tag color={phase.color}>{phase.status}</Tag>
                </div>
                <div className="px-4 py-2" style={{ background: phase.bg + '88' }}>
                  {phase.items.map((item, i) => (
                    <p key={i} className="text-xs mb-0.5 flex items-start gap-1.5" style={{ color: '#374151' }}>
                      <span style={{ color: phase.color }}>→</span>{item}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </PaperSlide>
      );

    case 'team':
      return (
        <PaperSlide>
          <div className="px-8 pt-6 pb-2">
            <SlideTitle accent="Leadership">Our</SlideTitle>
          </div>
          <div className="flex-1 px-8 pb-6 flex flex-col gap-5">
            <div className="flex gap-6 items-start p-6 rounded-2xl" style={{ background: 'linear-gradient(135deg, #0a0a1a, #111827)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
              <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.4)' }}>
                <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#f59e0b' }}>Founder & CEO</p>
                <h3 className="text-xl font-black text-white mb-2">Glean Moore</h3>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">Founded AureoTrack in 2025 with a mission to democratize professional trading tools for retail traders in emerging markets. Built a 58-feature platform from scratch with global reach across Asia and Africa.</p>
                <div className="flex gap-2 flex-wrap">
                  {['Platform Architecture', 'Trading Education', 'Community Building', 'AI Integration'].map(s => (
                    <span key={s} className="text-xs px-2.5 py-1 rounded-lg text-gray-300" style={{ background: 'rgba(255,255,255,0.08)' }}>{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'Asia Chapter', desc: 'Empowering traders across Southeast Asia', img: '/academy/photos/asia-chapter.jpeg' },
                { title: 'Africa Chapter', desc: "Building Africa's next generation of traders", img: '/academy/photos/africa-chapter.jpeg' },
              ].map(ch => (
                <div key={ch.title} className="rounded-xl overflow-hidden" style={{ border: '1px solid #e8eaf0' }}>
                  <div className="h-24 overflow-hidden">
                    <img src={ch.img} alt={ch.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-3" style={{ background: '#f8f9ff' }}>
                    <p className="font-bold text-xs" style={{ color: '#1a1a2e' }}>{ch.title}</p>
                    <p className="text-xs" style={{ color: '#6b7280' }}>{ch.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </PaperSlide>
      );

    case 'cta':
      return (
        <PaperSlide>
          <div className="flex-1 flex flex-col items-center justify-center text-center px-10 py-8" style={{ background: 'linear-gradient(145deg, #0a0a1a, #111827)' }}>
            <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(ellipse at 50% 50%, #f59e0b 0%, transparent 60%)' }} />
            <div className="relative">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-16 h-16 rounded-2xl mx-auto mb-5 object-cover" style={{ boxShadow: '0 0 30px rgba(245,158,11,0.4)' }} />
              <h2 className="text-4xl font-black text-white mb-2">Invest in <span style={{ color: '#f59e0b' }}>AureoTrack</span></h2>
              <p className="text-gray-400 mb-6 max-w-md mx-auto text-sm">The future of trading intelligence for the next billion traders in emerging markets.</p>
              <div className="grid grid-cols-3 gap-4 mb-8 max-w-sm mx-auto">
                {[
                  { label: 'Public Sale', value: '$0.20/ART' },
                  { label: 'Total Raised', value: '$3M' },
                  { label: 'TGE', value: 'Q3 2026' },
                ].map(s => (
                  <div key={s.label} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="font-black text-yellow-400 text-base">{s.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 justify-center flex-wrap mb-6">
                <button onClick={() => window.location.href = 'mailto:contact@aureotrack.com'} className="px-7 py-3 rounded-xl text-sm font-bold text-black transition-all" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 8px 20px rgba(245,158,11,0.4)' }}>
                  Contact for Investment →
                </button>
                <button onClick={() => window.location.href = '/whitepaper'} className="px-7 py-3 rounded-xl text-sm font-semibold text-white transition-all" style={{ border: '1px solid rgba(255,255,255,0.2)' }}>
                  Read Whitepaper
                </button>
              </div>
              <p className="text-gray-600 text-xs">contact@aureotrack.com · aureotrack.com · @aureotrack</p>
            </div>
          </div>
        </PaperSlide>
      );

    default:
      return null;
  }
}

export default function PitchDeck() {
  const [current, setCurrent] = useState(0);

  const slide = SLIDES[current];
  const goNext = () => setCurrent(s => Math.min(s + 1, SLIDES.length - 1));
  const goPrev = () => setCurrent(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }}>
      <Nav active="" />

      <div className="flex-1 max-w-screen-xl mx-auto w-full px-4 py-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-lg font-black text-white">AureoTrack <span style={{ color: '#f59e0b' }}>Pitch Deck</span></h1>
            <p className="text-xs text-gray-500">Slide {current + 1} of {SLIDES.length} — {slide.label}</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => window.location.href = '/whitepaper'} className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors border border-white/10 hover:bg-white/5">Whitepaper</button>
            <button onClick={() => window.location.href = '/tokenomics'} className="px-4 py-2 rounded-xl text-xs text-gray-400 hover:text-white transition-colors border border-white/10 hover:bg-white/5">Tokenomics</button>
            <button onClick={() => window.location.href = 'mailto:contact@aureotrack.com'} className="px-4 py-2 rounded-xl text-xs font-bold text-black" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>Contact →</button>
          </div>
        </div>

        {/* Slide tabs */}
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {SLIDES.map((s, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
              style={i === current
                ? { background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }
                : { background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }}>
              {i + 1}. {s.label}
            </button>
          ))}
        </div>

        {/* Slide */}
        <div className="flex-1 relative rounded-3xl overflow-hidden" style={{
          minHeight: '520px',
          boxShadow: '0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
        }}>
          <SlideContent type={slide.type} />
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button onClick={goPrev} disabled={current === 0}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-white transition-all disabled:opacity-20"
            style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)' }}>
            ← Previous
          </button>
          <div className="flex gap-1.5">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className="w-2 h-2 rounded-full transition-all"
                style={{ background: i === current ? '#f59e0b' : 'rgba(255,255,255,0.15)', transform: i === current ? 'scale(1.4)' : 'scale(1)' }} />
            ))}
          </div>
          <button onClick={goNext} disabled={current === SLIDES.length - 1}
            className="px-6 py-2.5 rounded-xl text-sm font-bold transition-all disabled:opacity-20"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#000', boxShadow: '0 4px 12px rgba(245,158,11,0.3)' }}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}