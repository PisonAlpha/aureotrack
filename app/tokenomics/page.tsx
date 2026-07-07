'use client';

import { useState } from 'react';
import Nav from '../components/Nav';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Legend } from 'recharts';

const ALLOCATION = [
  { name: 'Public Sale', percent: 15, tokens: 150000000, color: '#3b82f6', description: 'Available to public at $0.20 per ART token at TGE' },
  { name: 'Private Sale', percent: 10, tokens: 100000000, color: '#8b5cf6', description: 'Early investors at $0.18 per ART with vesting schedule' },
  { name: 'Angel Round', percent: 5, tokens: 50000000, color: '#ec4899', description: 'Founding investors at $0.15 per ART — closed Q1 2025' },
  { name: 'Team & Advisors', percent: 18, tokens: 180000000, color: '#f97316', description: 'Locked 1 year, then 24-month linear vesting' },
  { name: 'Ecosystem & Development', percent: 10, tokens: 100000000, color: '#10b981', description: 'Platform infrastructure, APIs, and development' },
  { name: 'Marketing & Growth', percent: 10, tokens: 100000000, color: '#06b6d4', description: 'Global marketing, partnerships, community growth' },
  { name: 'Treasury', percent: 20, tokens: 200000000, color: '#6b7280', description: 'Locked 3 years — strategic reserve, DAO governed after Year 3' },
  { name: 'Community & Airdrop', percent: 12, tokens: 120000000, color: '#f59e0b', description: '43.75% unlock at TGE, 36-month linear vesting — airdrop, rewards, liquidity' },
];

const VESTING = [
  { group: 'Community & Airdrop', tokens: '120M', tge: '43.75%', cliff: 'None', vesting: '36 months linear', y1: '43.75%', y2: '75%', y3: '100%' },
  { group: 'Public Sale', tokens: '150M', tge: '25%', cliff: 'None', vesting: '75% over 6 months', y1: '100%', y2: '100%', y3: '100%' },
  { group: 'Private Sale', tokens: '100M', tge: '10%', cliff: '3 months', vesting: '18 months linear', y1: '75%', y2: '100%', y3: '100%' },
  { group: 'Angel Round', tokens: '50M', tge: '10%', cliff: '3 months', vesting: '18 months linear', y1: '75%', y2: '100%', y3: '100%' },
  { group: 'Team & Advisors', tokens: '180M', tge: '0%', cliff: '12 months', vesting: '24 months after cliff', y1: '0%', y2: '50%', y3: '100%' },
  { group: 'Ecosystem & Dev', tokens: '100M', tge: '5%', cliff: 'None', vesting: '36 months linear', y1: '38%', y2: '71%', y3: '100%' },
  { group: 'Marketing & Growth', tokens: '100M', tge: '10%', cliff: 'None', vesting: '24 months linear', y1: '55%', y2: '100%', y3: '100%' },
  { group: 'Treasury', tokens: '200M', tge: '0%', cliff: '36 months', vesting: 'DAO governed post Year 3', y1: '0%', y2: '0%', y3: '0%*' },
];

const DISTRIBUTION = [
  { period: 'TGE', circ: 120, pub: 37.5, priv: 10, angel: 5, team: 0, eco: 5, mkt: 10, treasury: 0 },
  { period: 'M3', circ: 120, pub: 75, priv: 25, angel: 12.5, team: 0, eco: 13, mkt: 20, treasury: 0 },
  { period: 'M6', circ: 120, pub: 112.5, priv: 40, angel: 20, team: 0, eco: 22, mkt: 30, treasury: 0 },
  { period: 'M12', circ: 120, pub: 150, priv: 70, angel: 35, team: 0, eco: 38, mkt: 50, treasury: 0 },
  { period: 'M18', circ: 120, pub: 150, priv: 100, angel: 50, team: 45, eco: 55, mkt: 70, treasury: 0 },
  { period: 'M24', circ: 120, pub: 150, priv: 100, angel: 50, team: 90, eco: 72, mkt: 100, treasury: 0 },
  { period: 'M30', circ: 120, pub: 150, priv: 100, angel: 50, team: 135, eco: 88, mkt: 100, treasury: 0 },
  { period: 'M36', circ: 120, pub: 150, priv: 100, angel: 50, team: 180, eco: 100, mkt: 100, treasury: 200 },
];

const FUNDING = [
  { round: 'Angel Round', raised: '$700,000', price: '$0.15', tokens: '50M ART', date: 'Q1 2025', status: 'Closed', valuation: '$15M FDV', color: '#f59e0b', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200' },
  { round: 'Private Sale', raised: '$2,000,000', price: '$0.18', tokens: '100M ART', date: 'Q2 2026', status: 'Closed', valuation: '$18M FDV', color: '#8b5cf6', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200' },
  { round: 'Grants', raised: '$300,000', price: 'N/A', tokens: 'N/A', date: 'Q2 2026', status: 'Received', valuation: 'Non-dilutive', color: '#3b82f6', bg: 'from-blue-50 to-sky-50', border: 'border-blue-200' },
  { round: 'Public Sale', raised: '$30,000,000*', price: '$0.20', tokens: '150M ART', date: 'Q3 2026', status: 'Upcoming', valuation: '$200M FDV', color: '#10b981', bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200' },
];

const USE_OF_FUNDS = [
  { category: 'Team & Operations', pct: 30, amount: '$900,000', color: '#f97316' },
  { category: 'Marketing & Community', pct: 25, amount: '$750,000', color: '#8b5cf6' },
  { category: 'Academy & Live Training', pct: 20, amount: '$600,000', color: '#06b6d4' },
  { category: 'Token Launch & Listings', pct: 15, amount: '$450,000', color: '#10b981' },
  { category: 'Infrastructure & Dev', pct: 10, amount: '$300,000', color: '#f59e0b' },
];

const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload?.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-4">
        <p className="font-bold text-gray-900 text-sm">{d.name}</p>
        <p className="text-sm" style={{ color: d.color }}>{d.percent}% — {d.tokens.toLocaleString()} ART</p>
        <p className="text-xs text-gray-500 mt-1 max-w-48">{d.description}</p>
      </div>
    );
  }
  return null;
};

export default function Tokenomics() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen text-white" style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #111827 50%, #0a0a0a 100%)' }}>
      <Nav active="" />

      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-4 text-center border-b border-white/10">
        <div className="absolute inset-0 opacity-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, #f59e0b33 0%, transparent 70%)' }} />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-xs font-medium mb-6 uppercase tracking-widest">
            🪙 ART Token — Official Tokenomics
          </div>
          <h1 className="text-5xl sm:text-6xl font-black text-white mb-4 tracking-tight">AureoTrack<br /><span className="text-yellow-400">Tokenomics</span></h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">Complete token distribution, 3-year vesting schedule, funding rounds and economic model for the AureoTrack Token (ART)</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => window.location.href = '/airdrop'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-yellow-500/20">Join Airdrop Whitelist →</button>
            <button onClick={() => window.location.href = '/whitepaper'} className="px-6 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">Read Whitepaper</button>
            <button onClick={() => window.location.href = '/pitch-deck'} className="px-6 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-all">View Pitch Deck</button>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="py-10 px-4 border-b border-white/10">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Supply', value: '1,000,000,000', sub: 'ART Tokens', color: '#f59e0b' },
            { label: 'Initial Circulating', value: '12%', sub: '120M ART at TGE', color: '#3b82f6' },
            { label: 'Public Sale Price', value: '$0.20', sub: 'Per ART Token', color: '#10b981' },
            { label: 'TGE Date', value: 'Q3 2026', sub: 'Token Generation Event', color: '#8b5cf6' },
          ].map(stat => (
            <div key={stat.label} className="relative rounded-2xl p-5 text-center overflow-hidden" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <p className="text-2xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
              <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
              <p className="text-xs text-gray-600 mt-0.5">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-16">

        {/* Distribution Chart */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Token <span className="text-yellow-400">Distribution</span></h2>
            <p className="text-gray-500">1,000,000,000 ART total supply — hover each segment for details</p>
          </div>
          <div className="rounded-3xl overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #1e2a3a 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={ALLOCATION} cx="50%" cy="50%" innerRadius={75} outerRadius={140} dataKey="percent"
                      onMouseEnter={(_, i) => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}
                      strokeWidth={3} stroke="#0d0d0d">
                      {ALLOCATION.map((entry, i) => (
                        <Cell key={i} fill={entry.color} opacity={activeIndex === null || activeIndex === i ? 1 : 0.3}
                          style={{ filter: activeIndex === i ? `drop-shadow(0 0 8px ${entry.color}88)` : 'none', cursor: 'pointer' }} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-2">
                {ALLOCATION.map((item, i) => (
                  <div key={i}
                    className={"flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer " + (activeIndex === i ? 'bg-white/10 scale-[1.02]' : 'hover:bg-white/5')}
                    onMouseEnter={() => setActiveIndex(i)} onMouseLeave={() => setActiveIndex(null)}
                    style={{ border: activeIndex === i ? `1px solid ${item.color}44` : '1px solid transparent' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color, boxShadow: `0 0 6px ${item.color}88` }} />
                      <div>
                        <p className="text-sm font-semibold text-white">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.tokens.toLocaleString()} ART</p>
                      </div>
                    </div>
                    <span className="text-sm font-black" style={{ color: item.color }}>{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3-Year Distribution */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">3-Year <span className="text-yellow-400">Distribution Plan</span></h2>
            <p className="text-gray-500">Cumulative tokens unlocked (millions) across all groups over 36 months</p>
          </div>
          <div className="rounded-3xl overflow-hidden p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #1e2a3a 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <ResponsiveContainer width="100%" height={340}>
              <AreaChart data={DISTRIBUTION} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v + 'M'} />
                <Tooltip contentStyle={{ backgroundColor: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
                  formatter={(value: any, name: any) => [value + 'M ART', name]} labelStyle={{ color: '#9ca3af', fontSize: 12 }} />
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 11 }} />
                <Area type="monotone" dataKey="treasury" stackId="1" stroke="#6b7280" fill="#6b7280" fillOpacity={0.8} name="Treasury" />
                <Area type="monotone" dataKey="team" stackId="1" stroke="#f97316" fill="#f97316" fillOpacity={0.8} name="Team" />
                <Area type="monotone" dataKey="eco" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.8} name="Ecosystem" />
                <Area type="monotone" dataKey="mkt" stackId="1" stroke="#06b6d4" fill="#06b6d4" fillOpacity={0.8} name="Marketing" />
                <Area type="monotone" dataKey="priv" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.8} name="Private Sale" />
                <Area type="monotone" dataKey="angel" stackId="1" stroke="#ec4899" fill="#ec4899" fillOpacity={0.8} name="Angel" />
                <Area type="monotone" dataKey="pub" stackId="1" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.8} name="Public Sale" />
                <Area type="monotone" dataKey="circ" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.8} name="Community" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { label: 'At TGE (Month 0)', value: '~188M ART', sub: '18.8% circulating', color: '#f59e0b' },
                { label: 'End of Year 2', value: '~682M ART', sub: '68.2% circulating', color: '#3b82f6' },
                { label: 'End of Year 3', value: '1,000M ART', sub: '100% fully distributed', color: '#10b981' },
              ].map(m => (
                <div key={m.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <p className="text-lg font-black" style={{ color: m.color }}>{m.value}</p>
                  <p className="text-xs text-gray-400 mt-1">{m.label}</p>
                  <p className="text-xs text-gray-600">{m.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Vesting Schedule */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Vesting <span className="text-yellow-400">Schedule</span></h2>
            <p className="text-gray-500">Cumulative unlock percentages per allocation group over 3 years</p>
          </div>
          <div className="rounded-3xl overflow-hidden" style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f172a)' }}>
                    {['Allocation Group', 'Tokens', 'TGE Unlock', 'Cliff', 'Vesting', 'Year 1', 'Year 2', 'Year 3'].map((h, i) => (
                      <th key={i} className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {VESTING.map((row, i) => (
                    <tr key={i} style={{ background: i % 2 === 0 ? 'rgba(255,255,255,0.03)' : 'rgba(255,255,255,0.01)', borderTop: '1px solid rgba(255,255,255,0.05)' }}
                      className="hover:bg-white/5 transition-colors">
                      <td className="px-5 py-4 text-sm font-semibold text-white">{row.group}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{row.tokens}</td>
                      <td className="px-5 py-4">
                        <span className={"text-xs font-bold px-2 py-1 rounded-lg " + (row.tge === '0%' ? 'bg-red-500/10 text-red-400' : row.tge === '100%' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400')}>{row.tge}</span>
                      </td>
                      <td className="px-5 py-4 text-sm text-gray-500">{row.cliff}</td>
                      <td className="px-5 py-4 text-sm text-gray-400">{row.vesting}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-blue-400">{row.y1}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-purple-400">{row.y2}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-green-400">{row.y3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-600 px-5 py-3" style={{ background: 'rgba(255,255,255,0.02)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>* Treasury (20%) locked for 3 full years. Post-Year 3 release governed by ART token holder DAO vote.</p>
          </div>
        </section>

        {/* Funding Rounds */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Funding <span className="text-yellow-400">Rounds</span></h2>
            <p className="text-gray-500">$3,000,000 raised — Angel ($700K at $0.15) · Private Sale ($2M at $0.18) · Grants ($300K)</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FUNDING.map((round, i) => (
              <div key={i} className={`relative rounded-2xl overflow-hidden`} style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.05) inset' }}>
                <div className={`bg-gradient-to-br ${round.bg} p-6`}>
                  <div className="flex items-start justify-between mb-5">
                    <div>
                      <h3 className="font-black text-gray-900 text-xl">{round.round}</h3>
                      <p className="text-xs text-gray-500 mt-1">{round.date}</p>
                    </div>
                    <span className={"px-3 py-1 rounded-full text-xs font-bold " + (round.status === 'Upcoming' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-900/10 text-gray-700')}>
                      {round.status === 'Closed' || round.status === 'Received' ? '✓ ' : '◆ '}{round.status}
                    </span>
                  </div>
                  <p className="text-3xl font-black mb-4" style={{ color: round.color }}>{round.raised}</p>
                  <div className="space-y-2">
                    {[['Token Price', round.price], ['Tokens', round.tokens], ['Valuation', round.valuation]].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-center py-1.5 border-b border-black/5">
                        <span className="text-xs text-gray-500 font-medium">{k}</span>
                        <span className="text-xs font-bold text-gray-800">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-3">* Public sale target. Angel Round closed Q1 2025. Private Sale and Grants closed Q2 2026.</p>
        </section>

        {/* Use of Funds */}
        <section>
          <div className="mb-8">
            <h2 className="text-3xl font-black text-white mb-2">Use of <span className="text-yellow-400">Funds</span></h2>
            <p className="text-gray-500">How the $3,000,000 raised will be deployed across 4 quarters</p>
          </div>
          <div className="rounded-3xl p-8" style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #1e2a3a 100%)', boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
            <div className="space-y-5">
              {USE_OF_FUNDS.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color, boxShadow: `0 0 8px ${item.color}88` }} />
                      <span className="text-sm font-semibold text-white">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">{item.amount}</span>
                      <span className="text-sm font-black w-10 text-right" style={{ color: item.color }}>{item.pct}%</span>
                    </div>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: item.pct + '%', background: `linear-gradient(90deg, ${item.color}bb, ${item.color})`, boxShadow: `0 0 10px ${item.color}66` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="text-yellow-400 font-semibold">Legal Disclaimer:</span> This tokenomics document is for informational purposes only and does not constitute financial advice or an offer to sell securities. The ART token is a utility token designed to power the AureoTrack ecosystem. Token allocations and vesting schedules are subject to change before TGE. Always conduct your own research. AureoTrack was founded in 2025.
          </p>
        </div>

      </div>
    </div>
  );
}