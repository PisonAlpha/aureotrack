'use client';

import Nav from '../components/Nav';

const team = [
  {
    name: "Glean Moore",
    role: "Chief Executive Officer",
    photo: "/team/glean-moore.jpg",
    bio: "Glean leads AureoTrack's strategic direction, product vision, and global expansion. She oversees institutional partnerships and ecosystem development, bridging AI, financial markets, and practical learning into a unified platform.",
  },
  {
    name: "Isabella Morgan",
    role: "Chief Operating Officer",
    photo: "/team/isabella-morgan.jpg",
    bio: "Isabella oversees day-to-day operations, coordinating cross-functional teams and optimizing processes to ensure seamless execution of strategic initiatives across product, education, technology, and community.",
  },
  {
    name: "Aarav Sharma",
    role: "Chief Technology Officer",
    photo: "/team/aarav-sharma.jpg",
    bio: "Aarav leads platform architecture, AI integrations, blockchain connectivity, and cybersecurity. He ensures the platform remains secure, scalable, and reliable for users worldwide.",
  },
  {
    name: "Chloe Sterling",
    role: "Chief Marketing Officer",
    photo: "/team/chloe-sterling.jpg",
    bio: "Chloe drives AureoTrack's global brand strategy, user acquisition, and community growth — expanding the platform's reach while building a trusted network of traders, investors, and learners.",
  },
  {
    name: "Dr. Aris Thorne",
    role: "Head of AI & Financial Intelligence",
    photo: "/team/aris-thorne.png",
    bio: "Dr. Thorne leads AI research and financial intelligence, overseeing predictive analytics, machine learning systems, and data modelling that transform complex market data into actionable insights.",
  },
  {
    name: "Lee Do-hyun",
    role: "Head of Finance",
    photo: "/team/lee-do-hyun.jpg",
    bio: "Lee oversees treasury management, compliance, budgeting, and strategic financial planning — ensuring responsible governance and sustainable growth across the AureoTrack ecosystem.",
  },
];

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
            { value: '2025', label: 'Founded' },
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

        {/* ── LEADERSHIP TEAM SECTION ── */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <p className="text-yellow-500 text-sm font-medium mb-3 uppercase tracking-widest">
              The People Behind AureoTrack
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-gray-400 text-base max-w-2xl mx-auto">
              A team combining deep expertise in financial intelligence, AI, technology, and
              education — united by a shared vision to democratise professional-grade trading tools
              for a global audience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-yellow-500/40 transition-all duration-300"
              >
                {/* Photo */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={member.photo}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </div>

                {/* Info */}
                <div className="p-5">
                  <h3 className="text-white text-lg font-bold mb-0.5">{member.name}</h3>
                  <p className="text-yellow-500 text-xs font-semibold uppercase tracking-wide mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{member.bio}</p>
                </div>

                {/* Gold accent line on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-500 to-yellow-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
              </div>
            ))}
          </div>

          {/* Team tagline */}
          <p className="text-gray-600 text-sm text-center mt-10 max-w-3xl mx-auto">
            Together, our leadership team is committed to making professional-grade financial intelligence
            and education accessible to a global audience — driving innovation across the evolving financial landscape.
          </p>
        </div>
        {/* ── END LEADERSHIP TEAM SECTION ── */}

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
           <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4">
            <span className="text-2xl mb-3 block">📍</span>
            <p className="text-xs text-gray-500 mb-1">International Office</p>
            <p className="text-sm font-medium text-white">Herengracht 420, 1017 BZ Amsterdam</p>
            <p className="text-sm text-gray-400">North Holland, The Netherlands</p>
          </div>
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
            <a href="https://t.me/aureo_track" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.86l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.726z"/></svg>
              Telegram
            </a>
            <a href="https://t.me/Aureotrackofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248-1.97 9.289c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12L7.088 14.86l-2.95-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.718.726z"/></svg>
              Telegram Group
            </a>
          </div>
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