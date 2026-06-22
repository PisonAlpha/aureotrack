'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function Airdrop() {
  const [user, setUser] = useState<any>(null);
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');
  const [savingWallet, setSavingWallet] = useState(false);
  const [walletSaved, setWalletSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    fetchStatus(stored ? JSON.parse(stored).id : null);
  }, []);

  const fetchStatus = async (userId: string | null) => {
    try {
      const url = userId ? '/api/airdrop?userId=' + userId : '/api/airdrop';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setStatus(data);
        if (data.entry?.wallet_address) setWalletAddress(data.entry.wallet_address);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = async () => {
    if (!user) { window.location.href = '/login'; return; }
    if (!walletAddress.trim()) { setError('Enter a valid wallet address'); return; }
    setSavingWallet(true);
    setError(null);
    try {
      const res = await fetch('/api/airdrop', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, walletAddress: walletAddress.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setWalletSaved(true);
      fetchStatus(user.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSavingWallet(false);
    }
  };

  const TIERS = [
    { name: 'Challenge Participant', icon: '🎯', requirement: 'Join any Trading Challenge', allocation: '500 ART', color: 'border-blue-500/30 bg-blue-500/5' },
    { name: 'Challenge Completer', icon: '🏆', requirement: 'Complete any Trading Challenge', allocation: '2,000 ART', color: 'border-yellow-500/30 bg-yellow-500/5' },
    { name: 'Top Trader', icon: '👑', requirement: 'Finish in top 10 on Leaderboard', allocation: '5,000 ART', color: 'border-purple-500/30 bg-purple-500/5' },
  ];

  const TIMELINE = [
    { phase: 'Phase 1', title: 'Whitelist Open', desc: 'Join challenges to secure your spot', status: 'active' },
    { phase: 'Phase 2', title: 'Snapshot', desc: 'Final whitelist snapshot taken', status: 'upcoming' },
    { phase: 'Phase 3', title: 'TGE', desc: 'Token Generation Event — ART launches', status: 'upcoming' },
    { phase: 'Phase 4', title: 'Airdrop', desc: 'Tokens distributed to whitelist', status: 'upcoming' },
  ];

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoCommunity" />

      <div className="bg-black border-b border-white/10 py-16 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/5 to-transparent pointer-events-none" />
        <div className="relative">
          <span className="px-3 py-1 bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full text-xs font-medium mb-4 inline-block">
            🪙 Token Launch Coming Soon
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">AureoTrack Token</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-6">ART — the native token of the AureoTrack ecosystem. Trade, learn, and earn your way to the whitelist before TGE.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {!status?.isWhitelisted ? (
              <button onClick={() => window.location.href = '/challenges'} className="px-8 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors">
                Join a Challenge to Qualify →
              </button>
            ) : (
              <div className="px-8 py-3 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm font-bold">
                ✓ You are Whitelisted
              </div>
            )}
            <button onClick={() => window.location.href = '/trade'} className="px-8 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
              Start Demo Trading
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border-b border-white/10 py-6 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Whitelisted', value: loading ? '...' : (status?.totalWhitelisted || 0).toLocaleString() },
            { label: 'Max Supply', value: '1B ART' },
            { label: 'Airdrop Pool', value: '30M ART (5%)' },
            { label: 'TGE', value: 'Q3 2026' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {user && (
          <div className={"border rounded-2xl p-6 mb-10 " + (status?.isWhitelisted ? 'bg-green-500/5 border-green-500/20' : 'bg-white/5 border-white/10')}>
            <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
              <div>
                <h2 className="font-bold text-white text-lg mb-1">Your Whitelist Status</h2>
                <p className="text-gray-500 text-sm">{user.full_name} · {user.email}</p>
              </div>
              {status?.isWhitelisted ? (
                <span className="px-4 py-2 bg-green-500/10 border border-green-500/30 text-green-400 rounded-xl text-sm font-semibold">
                  ✓ Whitelisted
                </span>
              ) : (
                <span className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl text-sm font-semibold">
                  Not Yet Whitelisted
                </span>
              )}
            </div>

            {status?.isWhitelisted ? (
              <div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Qualified Via</p>
                    <p className="text-sm font-medium text-white capitalize">{status.entry?.qualified_via || 'Challenge'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Tier</p>
                    <p className="text-sm font-medium text-yellow-400 capitalize">{status.entry?.tier || 'Standard'}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Whitelisted On</p>
                    <p className="text-sm font-medium text-white">{status.entry?.whitelisted_at ? new Date(status.entry.whitelisted_at).toLocaleDateString() : '—'}</p>
                  </div>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <p className="text-sm font-medium text-gray-400 mb-3">Add Your Wallet Address to Receive Airdrop</p>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={walletAddress}
                      onChange={e => setWalletAddress(e.target.value)}
                      placeholder="0x... or Solana address"
                      className="flex-1 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                    />
                    <button
                      onClick={handleSaveWallet}
                      disabled={savingWallet}
                      className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50 whitespace-nowrap"
                    >
                      {savingWallet ? 'Saving...' : walletSaved ? '✓ Saved' : 'Save Wallet'}
                    </button>
                  </div>
                  {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
                  <p className="text-xs text-gray-600 mt-2">Supports EVM wallets (MetaMask, Trust Wallet) and Solana wallets (Phantom)</p>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-gray-400 text-sm mb-4">You are not yet whitelisted. Join any Trading Challenge to automatically qualify for the AureoTrack Token airdrop.</p>
                <button onClick={() => window.location.href = '/challenges'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
                  View Challenges →
                </button>
              </div>
            )}
          </div>
        )}

        {!user && (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-10 text-center">
            <p className="text-gray-400 mb-4">Login to check your whitelist status and add your wallet address</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">Login</button>
              <button onClick={() => window.location.href = '/register'} className="px-6 py-3 border border-white/20 text-gray-300 rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">Sign up free</button>
            </div>
          </div>
        )}

        <h2 className="text-xl font-bold text-white mb-6">Airdrop Tiers</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-12">
          {TIERS.map((tier, i) => (
            <div key={i} className={"border rounded-2xl p-6 " + tier.color}>
              <span className="text-3xl mb-3 block">{tier.icon}</span>
              <h3 className="font-bold text-white mb-1">{tier.name}</h3>
              <p className="text-sm text-gray-400 mb-4">{tier.requirement}</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <p className="text-xs text-gray-500 mb-0.5">Allocation</p>
                <p className="font-bold text-yellow-400">{tier.allocation}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-6">TGE Timeline</h2>
        <div className="relative mb-12">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 hidden sm:block" />
          <div className="space-y-4">
            {TIMELINE.map((item, i) => (
              <div key={i} className={"flex gap-4 p-5 rounded-2xl border " + (item.status === 'active' ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-white/5 border-white/10')}>
                <div className={"w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 " + (item.status === 'active' ? 'bg-yellow-500 text-black' : 'bg-white/10 text-gray-500')}>
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-white text-sm">{item.title}</p>
                    {item.status === 'active' && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full text-xs border border-yellow-500/20">Active Now</span>}
                  </div>
                  <p className="text-xs text-gray-500">{item.phase} · {item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-12">
          <h2 className="text-xl font-bold text-white mb-6">How to Qualify</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '1', title: 'Create an Account', desc: 'Sign up for free on AureoTrack and access the full platform', action: 'Sign Up', href: '/register' },
              { step: '2', title: 'Join a Challenge', desc: 'Go to Trading Challenges and join any challenge to get whitelisted', action: 'View Challenges', href: '/challenges' },
              { step: '3', title: 'Add Your Wallet', desc: 'Come back here and add your wallet address to receive the airdrop', action: 'Add Wallet', href: '/airdrop' },
            ].map(item => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-yellow-500 text-black rounded-full flex items-center justify-center text-lg font-bold mx-auto mb-4">{item.step}</div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{item.desc}</p>
                <button onClick={() => window.location.href = item.href} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-xs font-medium hover:bg-white/10 transition-colors">
                  {item.action} →
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-6">
          <h3 className="font-semibold text-yellow-400 mb-2">About the AureoTrack Token (ART)</h3>
          <p className="text-sm text-gray-400 leading-relaxed mb-3">ART is the native utility token of the AureoTrack ecosystem. It will power premium features, governance voting, staking rewards, and exclusive access to advanced trading tools and education content.</p>
          <p className="text-xs text-gray-600">This is not financial advice. Token details are subject to change. Airdrop allocations are estimated and may be adjusted based on total participants.</p>
        </div>
      </div>
    </div>
  );
}