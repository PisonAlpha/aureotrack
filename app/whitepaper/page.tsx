'use client';

import { useState } from 'react';
import Nav from '../components/Nav';

const SECTIONS = [
  { id: 'abstract', title: 'Abstract' },
  { id: 'introduction', title: '1. Introduction' },
  { id: 'problem', title: '2. Problem Statement' },
  { id: 'solution', title: '3. The AureoTrack Solution' },
  { id: 'products', title: '4. Product Suite' },
  { id: 'technology', title: '5. Technology Stack' },
  { id: 'token', title: '6. ART Token' },
  { id: 'tokenomics', title: '7. Tokenomics' },
  { id: 'roadmap', title: '8. Roadmap' },
  { id: 'team', title: '9. Team' },
  { id: 'market', title: '10. Market Opportunity' },
  { id: 'legal', title: '11. Legal Disclaimer' },
];

export default function Whitepaper() {
  const [activeSection, setActiveSection] = useState('abstract');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="" />

      <div className="bg-black border-b border-white/10 py-12 px-4 text-center">
        <p className="text-yellow-500 text-sm font-medium mb-3 uppercase tracking-widest">Official Document</p>
        <h1 className="text-4xl font-bold text-white mb-2">AureoTrack Whitepaper</h1>
        <p className="text-gray-400 text-sm">Version 1.0 — June 2026</p>
        <div className="flex gap-3 justify-center mt-6 flex-wrap">
          <button onClick={() => window.location.href = '/tokenomics'} className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors">
            View Tokenomics →
          </button>
          <button onClick={() => window.location.href = '/pitch-deck'} className="px-5 py-2.5 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
            View Pitch Deck
          </button>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8 flex gap-8">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white/5 border border-white/10 rounded-2xl p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-3 font-medium">Table of Contents</p>
            <nav className="space-y-1">
              {SECTIONS.map(section => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={"w-full text-left px-3 py-2 rounded-lg text-xs transition-colors " + (activeSection === section.id ? 'bg-yellow-500/10 text-yellow-400' : 'text-gray-500 hover:text-white hover:bg-white/5')}
                >
                  {section.title}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 max-w-3xl space-y-12">

          <section id="abstract" className="scroll-mt-24">
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-yellow-400 mb-4">Abstract</h2>
              <p className="text-gray-300 leading-relaxed mb-3">AureoTrack is a next-generation macro and crypto trading intelligence platform that democratizes access to professional-grade financial tools, real-time market data, and world-class trading education for retail traders globally.</p>
              <p className="text-gray-400 leading-relaxed mb-3">The platform combines five integrated product pillars — AureoTrack Intelligence, AureoTrade, AureoAcademy, AureoAI, and AureoCommunity — into a unified ecosystem powered by artificial intelligence and blockchain technology.</p>
              <p className="text-gray-400 leading-relaxed">The AureoTrack Token (ART) serves as the native utility token of the ecosystem, enabling governance, premium access, staking rewards, and community incentives. With a total supply of 1,000,000,000 ART tokens and a public sale price of $0.20, AureoTrack aims to build the most comprehensive trading intelligence platform for the next generation of global traders.</p>
            </div>
          </section>

          <section id="introduction" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">1. Introduction</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>The global financial markets have historically been dominated by institutional players with access to sophisticated tools, real-time data feeds, and professional research. Retail traders — particularly those in emerging markets across Africa, Asia, and Latin America — have been left behind, trading with inferior tools and incomplete information.</p>
              <p>AureoTrack was founded in 2026 by Glean Moore with a singular mission: to level the playing field. By combining cutting-edge artificial intelligence, real-time market data aggregation, and a comprehensive educational ecosystem, AureoTrack provides retail traders with the same quality of intelligence that institutional traders have relied upon for decades.</p>
              <p>The platform serves traders across all experience levels — from complete beginners learning their first concepts in AureoAcademy, to intermediate traders using AureoTrade's demo terminal and live TradingView charts, to advanced traders leveraging AureoAI's event impact simulation and arbitrage scanning across nine major exchanges.</p>
              <p>Since launch, AureoTrack has built a platform with 52+ features across five product areas, served users across multiple continents, and established chapter communities in Asia and Africa. The introduction of the ART token marks the next phase of AureoTrack's evolution — transforming from a platform into a fully decentralized trading intelligence ecosystem.</p>
            </div>
          </section>

          <section id="problem" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">2. Problem Statement</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {[
                { icon: '🚫', title: 'Information Asymmetry', desc: 'Retail traders lack access to the real-time intelligence, order flow data, and macro analysis that institutional traders use daily.' },
                { icon: '💸', title: 'Expensive Tools', desc: 'Professional trading platforms like Bloomberg Terminal cost $24,000+ per year — completely out of reach for most retail traders.' },
                { icon: '📚', title: 'Poor Education', desc: 'Most trading education is either too basic, too expensive, or taught by unqualified instructors with no real trading experience.' },
                { icon: '🌍', title: 'Geographic Exclusion', desc: 'Traders in Africa and Asia are systematically excluded from the best platforms, APIs, and market data due to geo-restrictions.' },
                { icon: '⚡', title: 'Fragmented Tools', desc: 'Traders use 5-10 different apps for charts, news, analysis, education, and community — creating friction and inefficiency.' },
                { icon: '🎰', title: 'High Failure Rate', desc: 'Over 80% of retail traders lose money, largely due to lack of proper education, tools, and risk management systems.' },
              ].map(problem => (
                <div key={problem.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <span className="text-2xl mb-2 block">{problem.icon}</span>
                  <h3 className="font-semibold text-white text-sm mb-1">{problem.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed">{problem.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="solution" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">3. The AureoTrack Solution</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>AureoTrack solves these problems through a unified, AI-powered trading intelligence platform that brings together everything a trader needs in one place — completely free at the base tier, with premium features unlocked through the ART token.</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-5">
                <h3 className="font-semibold text-white mb-3">The AureoTrack Advantage</h3>
                <ul className="space-y-2">
                  {[
                    'Real-time data from 40+ assets across crypto, forex, and commodities — free',
                    'AI-powered market analysis powered by Claude Sonnet — accessible to all users',
                    'TradingView-quality live charts with full technical analysis toolkit',
                    'Arbitrage scanner across 9 CEX and DEX sources simultaneously',
                    '60+ AI-generated trading lessons with quizzes and certifications',
                    'Live online training programs taught by experienced traders',
                    'Multi-chain portfolio tracking across 5 blockchain networks',
                    'Global community with chapter presence in Asia and Africa',
                  ].map((point, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-yellow-500 mt-0.5">✓</span>{point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <section id="products" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">4. Product Suite</h2>
            <div className="space-y-5">
              {[
                {
                  name: 'AureoTrack Intelligence',
                  icon: '📊',
                  desc: 'The core market intelligence hub providing real-time prices across 40+ assets, BTC/Gold correlation analysis, live news feed from crypto and global economy sources, and an exchange arbitrage scanner across 9 major venues.',
                  features: ['Real-time crypto, forex, and commodity prices', 'BTC/Gold normalized price correlation chart', 'Arbitrage scanner across 9 CEX + DEX sources', 'Live market news from 200+ sources'],
                },
                {
                  name: 'AureoTrade',
                  icon: '📈',
                  desc: 'A professional-grade demo trading terminal with TradingView live charts, 22 tradable pairs, spot and futures trading with up to 20x leverage, real-time P&L tracking, and a competitive leaderboard.',
                  features: ['TradingView live charts — same data as professional traders', '22 trading pairs (18 crypto + Gold + 3 forex)', 'Spot and futures with leverage up to 20x', 'Trading challenges with badge rewards'],
                },
                {
                  name: 'AureoAcademy',
                  icon: '🎓',
                  desc: 'A comprehensive trading education platform with 6 specialized schools, 60+ AI-generated lessons, an intelligent quiz system, certification issuance, live online training programs, and an AI Mentor that provides personalized learning paths.',
                  features: ['6 schools: Beginner, Forex, Crypto, TA, Risk, Psychology', '60+ AI-generated lessons with quizzes', 'Live online training programs ($149-$299)', 'Certifications upon school completion'],
                },
                {
                  name: 'AureoAI',
                  icon: '🤖',
                  desc: 'An AI intelligence layer powered by Claude that provides asset-specific market analysis with probability forecasts, an event impact simulator for macro scenarios, an AI Mentor for personalized learning, and a site-wide AI assistant.',
                  features: ['Market analysis with bull/neutral/bear probabilities', 'Event impact simulator (Fed rates, elections, etc.)', 'Personalized AI mentor based on trading performance', 'Site-wide AureoAI assistant on every page'],
                },
                {
                  name: 'AureoCommunity',
                  icon: '🌐',
                  desc: 'A global trading community with discussion rooms by market (Forex, Crypto, Gold, TA, Market News), a competitive leaderboard, trading challenges, global chapter presence in Asia and Africa, and the ART token airdrop whitelist.',
                  features: ['Discussion rooms organized by market type', 'Competitive leaderboard by return % and win rate', 'Trading challenges with progress tracking', 'TGE airdrop whitelist for challenge participants'],
                },
              ].map(product => (
                <div key={product.name} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl">{product.icon}</span>
                    <h3 className="font-bold text-white text-lg">{product.name}</h3>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{product.desc}</p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {product.features.map((f, i) => (
                      <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="text-yellow-500">→</span>{f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="technology" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">5. Technology Stack</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { category: 'Frontend', items: ['Next.js 16 (React framework)', 'TypeScript', 'Tailwind CSS', 'Recharts (data visualization)', 'TradingView Widget SDK'] },
                { category: 'Backend & Database', items: ['Next.js API Routes (serverless)', 'Supabase (PostgreSQL + Auth)', 'Vercel (edge deployment)', 'bcryptjs (password hashing)', 'JWT authentication'] },
                { category: 'AI & Intelligence', items: ['Anthropic Claude Sonnet 4.6', 'AI market analysis engine', 'Natural language event simulator', 'AI learning mentor', 'Personalized lesson generation'] },
                { category: 'Market Data', items: ['Binance API (crypto prices)', 'CoinGecko API (market data)', 'DexScreener (DEX data)', 'Frankfurter API (forex rates)', 'XAUT/CoinGecko (gold price)'] },
                { category: 'Email & Communications', items: ['Resend (transactional email)', 'Custom HTML email templates', 'Email verification system', 'Password reset via 6-digit code', 'Training enrollment notifications'] },
                { category: 'Blockchain Integration', items: ['ethers.js (EVM chains)', 'Solana Web3.js', 'MetaMask wallet connect', 'Multi-chain portfolio tracking', 'Airdrop whitelist management'] },
              ].map(stack => (
                <div key={stack.category} className="bg-white/5 border border-white/10 rounded-xl p-5">
                  <h3 className="font-semibold text-yellow-400 text-sm mb-3">{stack.category}</h3>
                  <ul className="space-y-1">
                    {stack.items.map((item, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                        <span className="text-gray-600">•</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="token" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">6. ART Token</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>The AureoTrack Token (ART) is the native utility token of the AureoTrack ecosystem. It is designed to align incentives between the platform, its users, and its community of traders globally.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: 'Premium Access', desc: 'ART holders unlock premium platform features including advanced AI analysis, priority data feeds, and exclusive trading signals.' },
                  { title: 'Governance', desc: 'ART holders vote on platform development priorities, new feature rollouts, and community fund allocations.' },
                  { title: 'Staking Rewards', desc: 'Stake ART to earn a share of platform revenue, distributed proportionally to all stakers.' },
                  { title: 'Education Credits', desc: 'Use ART to pay for live online training programs at a 20% discount versus fiat payment.' },
                  { title: 'Community Rewards', desc: 'Earn ART by completing trading challenges, passing academy certifications, and contributing to the community.' },
                  { title: 'Exchange Fee Discount', desc: 'Pay trading fees on the upcoming AureoTrack DEX using ART for a 50% discount on all fees.' },
                ].map(utility => (
                  <div key={utility.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <h3 className="font-semibold text-white text-sm mb-1">{utility.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{utility.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section id="tokenomics" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">7. Tokenomics</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center mb-6">
                {[
                  { label: 'Total Supply', value: '1,000,000,000 ART' },
                  { label: 'Public Sale Price', value: '$0.20' },
                  { label: 'Total Raised', value: '$3,000,000' },
                  { label: 'TGE', value: 'Q3 2026' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-yellow-400 font-bold text-sm">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-400">For complete tokenomics breakdown including vesting schedules and funding round details, see the <button onClick={() => window.location.href = '/tokenomics'} className="text-yellow-400 hover:underline bg-transparent border-0 cursor-pointer">Tokenomics page</button>.</p>
            </div>
          </section>

          <section id="roadmap" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">8. Roadmap</h2>
            <div className="space-y-4">
              {[
                { phase: 'Phase 1 — Foundation', period: 'Q1-Q2 2026', status: 'Completed', items: ['Platform launch with 52+ features', 'AureoAcademy with 6 schools and 60+ lessons', 'Demo trading terminal with TradingView charts', 'Email verification and user authentication', 'Angel Round and Private Sale — $3M raised'] },
                { phase: 'Phase 2 — Token Launch', period: 'Q3 2026', status: 'In Progress', items: ['ART Token Generation Event (TGE)', 'Public sale at $0.20 per ART', 'Airdrop distribution to whitelist participants', 'CEX and DEX exchange listings', 'Staking platform launch'] },
                { phase: 'Phase 3 — Mobile & Expansion', period: 'Q4 2026', status: 'Upcoming', items: ['AureoTrack mobile app (iOS + Android)', 'Premium subscription tiers gated by ART', 'Advanced AI signals and alerts', 'Expanded live training programs', 'Partnership with major exchanges'] },
                { phase: 'Phase 4 — Ecosystem', period: '2027', status: 'Planned', items: ['AureoTrack DEX launch', 'Governance voting portal', 'Institutional API access', 'White-label platform licensing', 'Global expansion to 10+ countries'] },
              ].map(phase => (
                <div key={phase.phase} className={"border rounded-2xl p-6 " + (phase.status === 'Completed' ? 'bg-green-500/5 border-green-500/20' : phase.status === 'In Progress' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/5 border-white/10')}>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <div>
                      <h3 className="font-bold text-white">{phase.phase}</h3>
                      <p className="text-xs text-gray-500">{phase.period}</p>
                    </div>
                    <span className={"px-3 py-1 rounded-full text-xs font-medium " + (phase.status === 'Completed' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : phase.status === 'In Progress' ? 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20' : 'bg-white/10 text-gray-400 border border-white/10')}>
                      {phase.status}
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.items.map((item, i) => (
                      <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                        <span className={phase.status === 'Completed' ? 'text-green-400' : phase.status === 'In Progress' ? 'text-yellow-400' : 'text-gray-600'}>→</span>{item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section id="team" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">9. Team</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Glean Moore</h3>
                  <p className="text-yellow-400 text-sm mb-2">Founder & CEO</p>
                  <p className="text-gray-400 text-sm leading-relaxed">Visionary founder of AureoTrack with a deep passion for democratizing financial market access for traders in emerging markets. Glean has built AureoTrack from the ground up into a 52-feature platform serving traders across Asia and Africa, with a growing global community and a mission-driven approach to financial education.</p>
                  <div className="mt-3">
                    <a href="https://x.com/aureotrack" target="_blank" rel="noopener noreferrer" className="text-xs text-yellow-400 hover:underline">@aureotrack on X</a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="market" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">10. Market Opportunity</h2>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>The global retail trading market represents one of the largest and fastest-growing financial sectors in the world, driven by increasing smartphone penetration, growing middle classes in emerging markets, and the rise of decentralized finance.</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { value: '$3.2T+', label: 'Daily Forex Trading Volume', desc: 'Global forex market daily volume' },
                  { value: '425M+', label: 'Crypto Users Globally', desc: 'And growing 15% year over year' },
                  { value: '$12.7B', label: 'EdFintech Market Size', desc: 'Financial education market by 2028' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/5 border border-white/10 rounded-xl p-5 text-center">
                    <p className="text-2xl font-bold text-yellow-400 mb-1">{stat.value}</p>
                    <p className="text-sm text-white font-medium mb-1">{stat.label}</p>
                    <p className="text-xs text-gray-500">{stat.desc}</p>
                  </div>
                ))}
              </div>
              <p>AureoTrack is uniquely positioned to capture a significant share of this market by targeting the underserved retail trader segment in Africa and Asia — two of the world's fastest-growing crypto and forex trading markets — with a comprehensive, AI-powered, and affordable platform.</p>
            </div>
          </section>

          <section id="legal" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-white mb-4 pb-2 border-b border-white/10">11. Legal Disclaimer</h2>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-xs text-gray-500 leading-relaxed mb-3">This whitepaper has been prepared for informational purposes only and does not constitute financial advice, investment advice, or an offer to sell or solicitation to buy any securities or financial instruments.</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">The ART token is a utility token designed to power the AureoTrack ecosystem. It is not intended to constitute a security, investment product, or financial instrument in any jurisdiction. Prospective purchasers should carefully review applicable laws and regulations in their jurisdiction before participating in any token sale.</p>
              <p className="text-xs text-gray-500 leading-relaxed mb-3">All information contained in this whitepaper is subject to change without notice. AureoTrack makes no representations or warranties of any kind, express or implied, about the completeness, accuracy, or reliability of any information in this document.</p>
              <p className="text-xs text-gray-500 leading-relaxed">Cryptocurrency and token investments carry significant risk. Never invest more than you can afford to lose. AureoTrack is not responsible for any financial losses arising from decisions made based on this document.</p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}