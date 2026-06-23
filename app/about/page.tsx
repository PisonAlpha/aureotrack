'use client';

import Nav from '../components/Nav';

export default function About() {
  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="" />

      {/* Hero */}
      <div className="bg-black border-b border-white/10 py-20 px-4 text-center">
        <p className="text-yellow-500 text-sm font-medium mb-3 uppercase tracking-widest">About AureoTrack</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Built for the next generation<br />of traders</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">AureoTrack is a macro and crypto trading intelligence platform — combining real-time market data, AI-powered analysis, world-class education, and a community of traders from across the globe.</p>
      </div>

      {/* Stats */}
      <div className="bg-[#111111] border-b border-white/10 py-10 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: '52+', label: 'Platform Features' },
            { value: '60+', label: 'Academy Lessons' },
            { value: '6', label: 'Trading Schools' },
            { value: '2026', label: 'Founded' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-3xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">

        {/* Mission */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-4">Our Mission</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-gray-300 text-lg leading-relaxed mb-4">At AureoTrack, we believe that access to professional-grade trading tools and education should not be limited to Wall Street or institutional investors.</p>
            <p className="text-gray-400 leading-relaxed">We are building the world's most comprehensive trading intelligence platform — one that gives everyday traders in Africa, Asia, and beyond the same tools, data, and knowledge that professional traders use to navigate global financial markets.</p>
          </div>
        </div>

        {/* What we offer */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">What We Offer</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { icon: '📊', title: 'Market Intelligence', desc: 'Real-time prices across 40+ crypto, forex, and commodity assets with live market sentiment analysis.' },
              { icon: '🤖', title: 'AureoAI', desc: 'AI-powered market analysis, event impact simulation, and personalized trading insights powered by Claude.' },
              { icon: '📈', title: 'Demo Trading Terminal', desc: 'Practice trading with $100,000 in virtual funds using live TradingView charts across 22 trading pairs.' },
              { icon: '🎓', title: 'AureoAcademy', desc: '6 specialized trading schools, 60+ AI-generated lessons, quizzes, certifications, and live online training programs.' },
              { icon: '🔍', title: 'Crypto Intelligence', desc: 'Token scanner with liquidity analysis and rug pull risk detection powered by DexScreener data.' },
              { icon: '⚡', title: 'Exchange Arbitrage', desc: 'Real-time arbitrage scanner across 9 major exchanges and DEX sources to find the best prices instantly.' },
              { icon: '🌐', title: 'Portfolio Tracking', desc: 'Multi-chain portfolio intelligence across BNB Chain, Ethereum, Polygon, Base, and Solana.' },
              { icon: '🪙', title: 'ART Token', desc: 'AureoTrack Token (ART) — 1 billion total supply, Q3 2026 TGE, with 30M tokens (5%) allocated for community airdrop.' },
            ].map(item => (
              <div key={item.title} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors">
                <span className="text-3xl mb-3 block">{item.icon}</span>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Founder */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Leadership</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col sm:flex-row gap-8 items-center">
            <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
              <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-yellow-500 text-sm font-medium mb-1 uppercase tracking-wide">Founder & CEO</p>
              <h3 className="text-2xl font-bold text-white mb-3">Glean Moore</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-3">Glean Moore is the visionary behind AureoTrack — a global trading intelligence platform designed to democratize access to professional-grade market tools and education for traders across Asia, Africa, and beyond.</p>
              <p className="text-gray-400 text-sm leading-relaxed">Through live training events, AI-powered lessons, and a growing global community, Glean and the AureoTrack team are building the next generation of informed, confident, and profitable traders.</p>
              <div className="flex items-center gap-3 mt-4">
                <a href="https://x.com/aureotrack" target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                  Follow on X →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Global Presence */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Global Presence</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Asia Chapter', image: '/academy/photos/asia-chapter.jpeg', desc: 'Empowering traders across Southeast Asia with world-class financial education and market intelligence tools.' },
              { title: 'Africa Chapter', image: '/academy/photos/africa-chapter.jpeg', desc: "Building Africa's next generation of financially literate traders and investors through accessible education." },
            ].map((chapter, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-48 overflow-hidden">
                  <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-2">{chapter.title}</h3>
                  <p className="text-sm text-gray-500">{chapter.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Contact Us</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: '📧', label: 'General Enquiries', value: 'contact@aureotrack.com', href: 'mailto:contact@aureotrack.com' },
              { icon: '🎓', label: 'Training & Education', value: 'contact@aureotrack.com', href: 'mailto:contact@aureotrack.com' },
              { icon: '🤝', label: 'Partnerships & VC', value: 'contact@aureotrack.com', href: 'mailto:contact@aureotrack.com' },
            ].map(contact => (
              <a key={contact.label} href={contact.href} className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors block">
                <span className="text-2xl mb-3 block">{contact.icon}</span>
                <p className="text-xs text-gray-500 mb-1">{contact.label}</p>
                <p className="text-sm font-medium text-yellow-400">{contact.value}</p>
              </a>
            ))}
          </div>
        </div>

        {/* Social */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Follow AureoTrack</h2>
          <p className="text-gray-400 text-sm mb-6">Stay updated with market insights, platform updates, and trading education</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="https://x.com/aureotrack" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              @aureotrack
            </a>
          </div>
          <p className="text-xs text-gray-600 mt-4">Telegram, Facebook & LinkedIn coming soon</p>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-black border-t border-white/10 py-16 px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Ready to start trading smarter?</h2>
        <p className="text-gray-400 text-sm mb-6">Join thousands of traders using AureoTrack to navigate global markets</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button onClick={() => window.location.href = '/register'} className="px-8 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors">
            Create Free Account →
          </button>
          <button onClick={() => window.location.href = '/academy'} className="px-8 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
            Explore Academy
          </button>
        </div>
      </div>
    </div>
  );
}