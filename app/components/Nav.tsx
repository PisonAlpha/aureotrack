'use client';

import { useState, useEffect, useRef } from 'react';

const PRODUCTS = [
{
    label: 'Intelligence',
    href: '/markets',
    sub: [
      { label: 'Market Overview', href: '/markets' },
      { label: 'BTC/Gold Chart', href: '/markets' },
      { label: 'Crypto Scanner', href: '/crypto' },
      { label: 'Exchange Arbitrage', href: '/exchanges' },
    ],
  },
  {
    label: 'AureoTrade',
    href: '/trade',
    sub: [
      { label: 'Demo Terminal', href: '/trade' },
      { label: 'Leaderboard', href: '/leaderboard' },
      { label: 'Challenges', href: '/challenges' },
      { label: 'Portfolio', href: '/portfolio' },
    ],
  },
 {
    label: 'AureoAcademy',
    href: '/academy',
    sub: [
      { label: 'All Schools', href: '/academy' },
      { label: 'Online Training', href: '/training' },
      { label: 'Certifications', href: '/academy' },
      { label: 'Community', href: '/community' },
    ],
  },
  {
    label: 'AureoAI',
    href: '/ai',
    sub: [
      { label: 'Market Analysis', href: '/ai' },
      { label: 'Event Simulator', href: '/ai' },
      { label: 'AI Mentor', href: '/academy' },
      { label: 'AI Assistant', href: '/ai' },
    ],
  },
{
    label: 'AureoCommunity',
    href: '/community',
    sub: [
      { label: 'Discussion Rooms', href: '/community' },
      { label: 'Leaderboard', href: '/leaderboard' },
      { label: 'Challenges', href: '/challenges' },
      { label: '🪙 Token Airdrop', href: '/airdrop' },
    ],
  },
  {
    label: 'AureoDoc',
    href: '/about',
    sub: [
      { label: '🏢 About AureoTrack', href: '/about' },
      { label: '📄 Whitepaper', href: '/whitepaper' },
      { label: '📊 Tokenomics', href: '/tokenomics' },
      { label: '🎯 Pitch Deck', href: '/pitch-deck' },
    ],
  },
];

export default function Nav({ active }: { active?: string }) {
  const [user, setUser] = useState<any>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('aureotrack_user');
    setUser(null);
    window.location.href = '/';
  };

  return (
    <header className="border-b border-white/10 sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur">
      <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0 flex-shrink-0">
          <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-bold text-white text-base hidden sm:block">AureoTrack</span>
        </button>

        <nav className="hidden lg:flex items-center gap-1">
          {PRODUCTS.map(product => (
            <div key={product.label} className="relative"
                onMouseEnter={() => {
                  if (closeTimer.current) clearTimeout(closeTimer.current);
                  setOpenMenu(product.label);
                }}
                onMouseLeave={() => {
                  closeTimer.current = setTimeout(() => setOpenMenu(null), 150);
                }}
              >
              <button
                onClick={() => window.location.href = product.href}
                className={"px-3 py-1.5 rounded-lg text-sm transition-colors bg-transparent border-0 cursor-pointer " + (active === product.label ? 'text-yellow-400 bg-yellow-400/10' : 'text-gray-400 hover:text-white hover:bg-white/5')}
              >
                {product.label}
              </button>
              {openMenu === product.label && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-[#1a1a1a] border border-white/10 rounded-xl shadow-2xl py-2 z-50">
                  {product.sub.map(item => (
                    <button
                      key={item.label}
                      onClick={() => { window.location.href = item.href; setOpenMenu(null); }}
                      className="w-full text-left px-4 py-2.5 text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 hidden sm:block">{user.full_name}</span>
              <button onClick={handleLogout} className="px-3 py-1.5 border border-white/20 text-gray-300 rounded-lg text-sm hover:bg-white/5 transition-colors bg-transparent cursor-pointer">Logout</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button onClick={() => window.location.href = '/login'} className="px-3 py-1.5 text-gray-300 text-sm hover:text-white bg-transparent border-0 cursor-pointer">Login</button>
              <button onClick={() => window.location.href = '/register'} className="px-3 py-1.5 bg-yellow-500 text-black rounded-lg text-sm font-semibold hover:bg-yellow-400 transition-colors">Sign up</button>
            </div>
          )}
          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden bg-transparent border-0 cursor-pointer text-white p-1 text-xl">☰</button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0a0a0a] px-4 py-4 space-y-4">
          {PRODUCTS.map(product => (
            <div key={product.label}>
              <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">{product.label}</p>
              <div className="grid grid-cols-2 gap-1">
                {product.sub.map(item => (
                  <button key={item.label} onClick={() => { window.location.href = item.href; setMobileOpen(false); }} className="text-left px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors bg-transparent border-0 cursor-pointer">
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs text-gray-600 uppercase tracking-wide mb-2">Follow Us</p>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'X / Twitter', href: 'https://x.com/aureotrack' },
                { label: 'Telegram', href: 'https://t.me/aureo_track' },
                { label: 'Facebook', href: 'https://www.facebook.com/share/1LX95LaMVj/' },
              ].map(social => (
                <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white transition-colors">
                  {social.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}