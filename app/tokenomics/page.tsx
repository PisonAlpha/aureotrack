'use client';

import { useState } from 'react';
import Nav from '../components/Nav';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Legend } from 'recharts';

const ALLOCATION = [
  { name: 'Initial Circulating Supply', percent: 12, tokens: 120000000, color: '#f59e0b', description: 'Available at TGE — public sale, community airdrop, and initial liquidity' },
  { name: 'Public Sale', percent: 15, tokens: 150000000, color: '#3b82f6', description: 'Available to public at $0.20 per ART token' },
  { name: 'Private Sale', percent: 10, tokens: 100000000, color: '#8b5cf6', description: 'Early investors at $0.18 per ART with vesting schedule' },
  { name: 'Angel Round', percent: 5, tokens: 50000000, color: '#ec4899', description: 'Founding investors at $0.15 per ART with vesting' },
  { name: 'Team & Advisors', percent: 18, tokens: 180000000, color: '#f97316', description: 'Core team tokens — locked for 1 year, then 24-month vesting' },
  { name: 'Ecosystem & Development', percent: 10, tokens: 100000000, color: '#10b981', description: 'Platform development, API integrations, infrastructure' },
  { name: 'Marketing & Growth', percent: 10, tokens: 100000000, color: '#06b6d4', description: 'Global marketing, partnerships, community growth' },
  { name: 'Treasury', percent: 20, tokens: 200000000, color: '#6b7280', description: 'Locked for 3 years — strategic reserve for long-term ecosystem' },
];

const VESTING = [
  { group: 'Initial Circulating (12%)', cliff: 'None', vesting: 'Available at TGE', tge: '100%', year1: '100%', year2: '100%', year3: '100%' },
  { group: 'Public Sale (15%)', cliff: 'None', vesting: '25% at TGE, 75% over 6 months', tge: '25%', year1: '100%', year2: '100%', year3: '100%' },
  { group: 'Private Sale (10%)', cliff: '3 months', vesting: '18 months linear', tge: '10%', year1: '75%', year2: '100%', year3: '100%' },
  { group: 'Angel Round (5%)', cliff: '3 months', vesting: '18 months linear', tge: '10%', year1: '75%', year2: '100%', year3: '100%' },
  { group: 'Team & Advisors (18%)', cliff: '12 months', vesting: '24 months linear after cliff', tge: '0%', year1: '0%', year2: '50%', year3: '100%' },
  { group: 'Ecosystem & Dev (10%)', cliff: 'None', vesting: '36 months linear', tge: '5%', year1: '38%', year2: '71%', year3: '100%' },
  { group: 'Marketing & Growth (10%)', cliff: 'None', vesting: '24 months linear', tge: '10%', year1: '55%', year2: '100%', year3: '100%' },
  { group: 'Treasury (20%)', cliff: '36 months', vesting: 'Locked 3 years, then governed release', tge: '0%', year1: '0%', year2: '0%', year3: '0%' },
];

// 3-year distribution plan (cumulative % unlocked per allocation)
const DISTRIBUTION_PLAN = [
  { period: 'TGE', btc: 120, pub: 37.5, priv: 10, angel: 10, team: 0, eco: 5, mkt: 10, treasury: 0, total: 192.5 },
  { period: 'Month 3', btc: 120, pub: 75, priv: 25, angel: 25, team: 0, eco: 13, mkt: 20, treasury: 0, total: 278 },
  { period: 'Month 6', btc: 120, pub: 112.5, priv: 40, angel: 40, team: 0, eco: 22, mkt: 30, treasury: 0, total: 364.5 },
  { period: 'Month 9', btc: 120, pub: 150, priv: 55, angel: 55, team: 0, eco: 30, mkt: 40, treasury: 0, total: 450 },
  { period: 'Month 12', btc: 120, pub: 150, priv: 70, angel: 70, team: 0, eco: 38, mkt: 50, treasury: 0, total: 498 },
  { period: 'Month 18', btc: 120, pub: 150, priv: 100, angel: 100, team: 45, eco: 55, mkt: 70, treasury: 0, total: 640 },
  { period: 'Month 24', btc: 120, pub: 150, priv: 100, angel: 100, team: 90, eco: 72, mkt: 100, treasury: 0, total: 732 },
  { period: 'Month 30', btc: 120, pub: 150, priv: 100, angel: 100, team: 135, eco: 88, mkt: 100, treasury: 0, total: 793 },
  { period: 'Month 36', btc: 120, pub: 150, priv: 100, angel: 100, team: 180, eco: 100, mkt: 100, treasury: 200, total: 1000 },
];

const FUNDING_ROUNDS = [
  { round: 'Angel Round', raised: '$700,000', tokens: '50,000,000', price: '$0.15', valuation: '$15M', date: 'Q1 2025', status: 'Closed', color: 'border-yellow-500/30 bg-yellow-500/5' },
  { round: 'Private Sale', raised: '$2,000,000', tokens: '100,000,000', price: '$0.18', valuation: '$18M', date: 'Q2 2026', status: 'Closed', color: 'border-purple-500/30 bg-purple-500/5' },
  { round: 'Grants', raised: '$300,000', tokens: 'N/A', price: 'N/A', valuation: 'N/A', date: 'Q2 2026', status: 'Closed', color: 'border-blue-500/30 bg-blue-500/5' },
  { round: 'Public Sale', raised: '$30,000,000*', tokens: '150,000,000', price: '$0.20', valuation: '$200M', date: 'Q3 2026', status: 'Upcoming', color: 'border-green-500/30 bg-green-500/5' },
];

const USE_OF_FUNDS = [
  { category: 'Team & Operations', percent: 30, amount: '$900,000', color: '#f97316' },
  { category: 'Marketing & Community', percent: 25, amount: '$750,000', color: '#8b5cf6' },
  { category: 'Academy & Live Training', percent: 20, amount: '$600,000', color: '#06b6d4' },
  { category: 'Token Launch & Exchange Listings', percent: 15, amount: '$450,000', color: '#10b981' },
  { category: 'Infrastructure & Development', percent: 10, amount: '$300,000', color: '#f59e0b' },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const d = payload[0].payload;
    return (
      <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-3 shadow-2xl">
        <p className="text-white font-semibold text-sm">{d.name}</p>
        <p className="text-yellow-400 text-sm">{d.percent}% — {d.tokens?.toLocaleString()} ART</p>
      </div>
    );
  }
  return null;
};

export default function Tokenomics() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="" />

      <div className="bg-black border-b border-white/10 py-16 px-4 text-center">
        <p className="text-yellow-500 text-sm font-medium mb-3 uppercase tracking-widest">ART Token</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">AureoTrack Tokenomics</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">Complete token distribution, 3-year vesting schedule, funding rounds and use of funds for the AureoTrack Token (ART)</p>
        <div className="flex gap-4 justify-center mt-8 flex-wrap">
          <button onClick={() => window.location.href = '/airdrop'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors">
            Join Airdrop Whitelist →
          </button>
          <button onClick={() => window.location.href = '/whitepaper'} className="px-6 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/5 transition-colors">
            Read Whitepaper
          </button>
        </div>
      </div>

      <div className="bg-[#111111] border-b border-white/10 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Total Supply', value: '1,000,000,000', sub: 'ART Tokens' },
            { label: 'Initial Circulating', value: '12%', sub: '120M ART at TGE' },
            { label: 'Public Sale Price', value: '$0.20', sub: 'Per ART Token' },
            { label: 'TGE Date', value: 'Q3 2026', sub: 'Token Generation Event' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-yellow-400">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              <p className="text-xs text-gray-600">{stat.sub}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12">

        {/* Token Distribution Chart */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Token Distribution</h2>
          <p className="text-gray-500 text-sm mb-8">1,000,000,000 ART total supply — only 12% circulating at TGE</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="w-full lg:w-1/2 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ALLOCATION}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={140}
                      dataKey="percent"
                      onMouseEnter={(_, index) => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      strokeWidth={2}
                      stroke="#0d0d0d"
                    >
                      {ALLOCATION.map((entry, index) => (
                        <Cell key={index} fill={entry.color} opacity={activeIndex === null || activeIndex === index ? 1 : 0.4} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="w-full lg:w-1/2 space-y-3">
                {ALLOCATION.map((item, i) => (
                  <div
                    key={i}
                    className={"flex items-center justify-between p-3 rounded-xl transition-colors cursor-pointer " + (activeIndex === i ? 'bg-white/10' : 'hover:bg-white/5')}
                    onMouseEnter={() => setActiveIndex(i)}
                    onMouseLeave={() => setActiveIndex(null)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                      <div>
                        <p className="text-sm font-medium text-white">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.tokens.toLocaleString()} ART</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-white">{item.percent}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3-Year Distribution Plan */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">3-Year Token Distribution Plan</h2>
          <p className="text-gray-500 text-sm mb-8">Cumulative tokens unlocked (in millions) across all allocation groups over 36 months</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={DISTRIBUTION_PLAN} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <XAxis dataKey="period" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => v + 'M'} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any, name: any) => [value + 'M ART', name]}
                  labelStyle={{ color: '#9ca3af', fontSize: 12 }}
                />
                <Legend wrapperStyle={{ color: '#9ca3af', fontSize: 11 }} />
                <Area type="monotone" dataKey="treasury" stackId="1" stroke="#6b7280" fill="#6b7280" name="Treasury" />
                <Area type="monotone" dataKey="team" stackId="1" stroke="#f97316" fill="#f97316" name="Team" />
                <Area type="monotone" dataKey="eco" stackId="1" stroke="#10b981" fill="#10b981" name="Ecosystem" />
                <Area type="monotone" dataKey="mkt" stackId="1" stroke="#06b6d4" fill="#06b6d4" name="Marketing" />
                <Area type="monotone" dataKey="priv" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Private Sale" />
                <Area type="monotone" dataKey="angel" stackId="1" stroke="#ec4899" fill="#ec4899" name="Angel" />
                <Area type="monotone" dataKey="pub" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Public Sale" />
                <Area type="monotone" dataKey="btc" stackId="1" stroke="#f59e0b" fill="#f59e0b" name="Initial Circulating" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-4 p-4 bg-yellow-500/5 border border-yellow-500/20 rounded-xl">
              <p className="text-xs text-yellow-400 font-medium mb-1">Key Insight</p>
              <p className="text-xs text-gray-400">Only <span className="text-white font-semibold">12% (120M ART)</span> circulates at TGE. Treasury (20%) is locked for 3 years. Team tokens (18%) are locked for 1 year before vesting begins. Full supply reaches circulation at Month 36 (Year 3).</p>
            </div>
          </div>
        </div>

        {/* Vesting Schedule */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">Vesting Schedule</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-white/5">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500">Allocation Group</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-gray-500">Cliff</th>
                    <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Vesting</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-yellow-500">TGE</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-blue-400">Year 1</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-purple-400">Year 2</th>
                    <th className="text-center px-4 py-3 text-xs font-medium text-green-400">Year 3</th>
                  </tr>
                </thead>
                <tbody>
                  {VESTING.map((row, i) => (
                    <tr key={i} className="border-t border-white/5 hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-white">{row.group}</td>
                      <td className="px-4 py-4 text-center text-sm text-gray-400">{row.cliff}</td>
                      <td className="px-4 py-4 text-sm text-gray-400">{row.vesting}</td>
                      <td className="px-4 py-4 text-center">
                        <span className={"text-sm font-semibold " + (row.tge === '0%' ? 'text-red-400' : row.tge === '100%' ? 'text-green-400' : 'text-yellow-400')}>{row.tge}</span>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-blue-400 font-medium">{row.year1}</td>
                      <td className="px-4 py-4 text-center text-sm text-purple-400 font-medium">{row.year2}</td>
                      <td className="px-4 py-4 text-center text-sm text-green-400 font-medium">{row.year3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="text-xs text-gray-600 mt-2">* Percentages show cumulative tokens unlocked as a % of that allocation group's total</p>
        </div>

        {/* Funding Rounds */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Funding Rounds</h2>
          <p className="text-gray-500 text-sm mb-8">Total raised to date: <span className="text-yellow-400 font-semibold">$3,000,000</span> (Angel $700K + Private Sale $2M + Grants $300K)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FUNDING_ROUNDS.map((round, i) => (
              <div key={i} className={"border rounded-2xl p-6 " + round.color}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-lg">{round.round}</h3>
                    <p className="text-xs text-gray-500">{round.date}</p>
                  </div>
                  <span className={"px-2 py-1 rounded-full text-xs font-medium " + (round.status === 'Closed' ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20')}>
                    {round.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between"><span className="text-xs text-gray-500">Amount Raised</span><span className="text-sm font-bold text-white">{round.raised}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-gray-500">Token Price</span><span className="text-sm font-medium text-gray-300">{round.price}</span></div>
                  <div className="flex justify-between"><span className="text-xs text-gray-500">Tokens Allocated</span><span className="text-sm font-medium text-gray-300">{round.tokens} ART</span></div>
                  <div className="flex justify-between"><span className="text-xs text-gray-500">Valuation</span><span className="text-sm font-medium text-gray-300">{round.valuation}</span></div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-4">* Public sale target — not yet raised. Angel Round ($700K) closed Q1 2025. Private Sale ($2M) and Grants ($300K) closed Q2 2026.</p>
        </div>

        {/* Use of Funds */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-2">Use of Funds</h2>
          <p className="text-gray-500 text-sm mb-8">How the $3,000,000 raised will be deployed</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="space-y-4">
              {USE_OF_FUNDS.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-white">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-400">{item.amount}</span>
                      <span className="text-sm font-bold text-white w-10 text-right">{item.percent}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: item.percent + '%', backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="text-yellow-400 font-semibold">Disclaimer:</span> This tokenomics document is for informational purposes only and does not constitute financial advice or an offer to sell securities. Token allocations and vesting schedules are subject to change before TGE. The ART token is a utility token designed to power the AureoTrack ecosystem. Always conduct your own research before making any investment decisions.
          </p>
        </div>
      </div>
    </div>
  );
}