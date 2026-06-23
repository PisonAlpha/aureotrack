'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const PROGRAMS = [
  {
    id: 'forex-mastery',
    title: 'Forex Mastery Program',
    subtitle: 'Live Online Training',
    duration: '8 Weeks',
    sessions: '3x per week',
    level: 'Beginner to Intermediate',
    price: '$299',
    badge: '🏆',
    color: 'border-blue-500/30',
    highlights: [
      'Live sessions with certified instructors',
      'Currency pair analysis and trade setups',
      'Market structure and smart money concepts',
      'Personal mentorship and feedback',
      'Certificate of completion',
      'Lifetime access to recordings',
    ],
    nextStart: 'July 7, 2026',
    spots: 12,
  },
  {
    id: 'crypto-trading',
    title: 'Crypto Trading Bootcamp',
    subtitle: 'Intensive Live Training',
    duration: '6 Weeks',
    sessions: '4x per week',
    level: 'All Levels',
    price: '$249',
    badge: '₿',
    color: 'border-yellow-500/30',
    highlights: [
      'On-chain analysis and whale tracking',
      'DeFi protocols and yield strategies',
      'Token evaluation and rug pull detection',
      'Live trade walkthroughs',
      'Private Discord community',
      'Certificate of completion',
    ],
    nextStart: 'July 14, 2026',
    spots: 20,
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis Masterclass',
    subtitle: 'Live Online Training',
    duration: '4 Weeks',
    sessions: '2x per week',
    level: 'Intermediate',
    price: '$199',
    badge: '📊',
    color: 'border-purple-500/30',
    highlights: [
      'Advanced chart pattern recognition',
      'Fibonacci, MACD, RSI mastery',
      'Multi-timeframe analysis',
      'Live market sessions',
      'Trade journal review',
      'Certificate of completion',
    ],
    nextStart: 'July 21, 2026',
    spots: 15,
  },
  {
    id: 'risk-management',
    title: 'Risk & Psychology Intensive',
    subtitle: 'Live Online Training',
    duration: '2 Weeks',
    sessions: 'Daily',
    level: 'All Levels',
    price: '$149',
    badge: '🛡️',
    color: 'border-green-500/30',
    highlights: [
      'Position sizing and capital protection',
      'Trading psychology and emotional control',
      'Building a consistent trading routine',
      'Live Q&A with Glean Moore',
      'Personalized risk assessment',
      'Certificate of completion',
    ],
    nextStart: 'July 28, 2026',
    spots: 25,
  },
];

export default function Training() {
  const [user, setUser] = useState<any>(null);
  const [selected, setSelected] = useState<any>(null);
  const [step, setStep] = useState<'browse' | 'enroll' | 'success'>('browse');
  const [form, setForm] = useState({ name: '', email: '', phone: '', experience: '', goals: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) {
      const u = JSON.parse(stored);
      setUser(u);
      setForm(f => ({ ...f, name: u.full_name || '', email: u.email || '' }));
    }
  }, []);

 const handleEnroll = async () => {
    if (!form.name || !form.email) { setError('Name and email are required'); return; }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/training', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          experience: form.experience,
          goals: form.goals,
          programId: selected.id,
          programTitle: selected.title,
          programPrice: selected.price,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep('success');
    } catch (err: any) {
      setError(err.message || 'Failed to submit enrollment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <Nav active="AureoAcademy" />
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold text-white mb-4">Enrollment Confirmed!</h1>
          <p className="text-gray-400 mb-2">Thank you, <span className="text-yellow-400">{form.name}</span>!</p>
          <p className="text-gray-400 mb-8">Your enrollment for <span className="text-white font-semibold">{selected?.title}</span> has been received. Our team will contact you at <span className="text-yellow-400">{form.email}</span> with next steps.</p>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 text-left">
            <h3 className="font-semibold text-white mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-gray-400">
              {['You will receive a confirmation email within 24 hours', 'Our team will send you payment instructions', 'Once payment is confirmed, you get access to the private group', 'Your first live session starts on ' + selected?.nextStart].map((item, i) => (
                <li key={i} className="flex items-start gap-2"><span className="text-yellow-500">→</span>{item}</li>
              ))}
            </ul>
          </div>
          <div className="flex gap-3 justify-center flex-wrap">
            <button onClick={() => { setStep('browse'); setSelected(null); }} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Browse More Programs
            </button>
            <button onClick={() => window.location.href = '/academy'} className="px-6 py-3 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
              Go to AureoAcademy
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'enroll' && selected) {
    return (
      <div className="min-h-screen bg-[#0d0d0d] text-white">
        <Nav active="AureoAcademy" />
        <div className="max-w-2xl mx-auto px-4 py-8">
          <button onClick={() => setStep('browse')} className="text-sm text-gray-500 hover:text-white mb-6 bg-transparent border-0 cursor-pointer flex items-center gap-2">
            ← Back to Programs
          </button>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{selected.badge}</span>
              <div>
                <h2 className="font-bold text-white">{selected.title}</h2>
                <p className="text-sm text-gray-400">{selected.duration} · {selected.sessions} · Starts {selected.nextStart}</p>
              </div>
              <span className="ml-auto text-2xl font-bold text-yellow-400">{selected.price}</span>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold text-white mb-5">Enrollment Form</h3>

            {error && <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-4">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your full name" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 234 567 8900" className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Trading Experience Level</label>
                <select value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white focus:outline-none focus:border-yellow-500/50">
                  <option value="" className="bg-gray-900">Select your level</option>
                  <option value="complete-beginner" className="bg-gray-900">Complete Beginner</option>
                  <option value="beginner" className="bg-gray-900">Beginner (less than 1 year)</option>
                  <option value="intermediate" className="bg-gray-900">Intermediate (1-3 years)</option>
                  <option value="advanced" className="bg-gray-900">Advanced (3+ years)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Your Trading Goals</label>
                <textarea value={form.goals} onChange={e => setForm(f => ({ ...f, goals: e.target.value }))} placeholder="What do you hope to achieve from this program?" rows={3} className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 resize-none" />
              </div>

              <button onClick={handleEnroll} disabled={submitting} className="w-full py-3.5 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                {submitting ? 'Submitting enrollment...' : 'Confirm Enrollment — ' + selected.price}
              </button>
              <p className="text-xs text-gray-600 text-center">Our team will contact you within 24 hours with payment instructions. No payment required now.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoAcademy" />

      <div className="bg-black border-b border-white/10 py-14 px-4 text-center">
        <p className="text-yellow-500 text-sm font-medium mb-3 uppercase tracking-widest">Live Online Training</p>
        <h1 className="text-4xl font-bold text-white mb-4">AureoTrack Training Programs</h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-sm leading-relaxed">Learn directly from experienced traders in live sessions. Get personalized feedback, real-time trade analysis, and a globally recognized certificate.</p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {[
            { icon: '🎓', label: 'Live Sessions', value: 'Expert-led' },
            { icon: '🌍', label: 'Students', value: '2,000+' },
            { icon: '🏆', label: 'Certificates', value: 'Globally recognized' },
            { icon: '💬', label: 'Support', value: '24/7 Discord' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <span className="text-3xl mb-2 block">{stat.icon}</span>
              <p className="font-bold text-white">{stat.value}</p>
              <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <h2 className="text-xl font-bold text-white mb-6">Available Programs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          {PROGRAMS.map(program => (
            <div key={program.id} className={"bg-white/5 border rounded-2xl p-6 hover:border-white/30 transition-all " + program.color}>
              <div className="flex items-start justify-between mb-4">
                <span className="text-4xl">{program.badge}</span>
                <div className="text-right">
                  <p className="text-2xl font-bold text-yellow-400">{program.price}</p>
                  <p className="text-xs text-gray-500">per person</p>
                </div>
              </div>
              <h3 className="font-bold text-white text-lg mb-1">{program.title}</h3>
              <p className="text-sm text-yellow-400 mb-3">{program.subtitle}</p>
              <div className="flex gap-4 text-xs text-gray-500 mb-4">
                <span>📅 {program.duration}</span>
                <span>📆 {program.sessions}</span>
                <span>🎯 {program.level}</span>
              </div>
              <ul className="space-y-1.5 mb-5">
                {program.highlights.map((h, i) => (
                  <li key={i} className="text-sm text-gray-400 flex items-start gap-2">
                    <span className="text-yellow-500 mt-0.5">✓</span>{h}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-gray-500">Next cohort starts</p>
                  <p className="text-sm font-medium text-white">{program.nextStart}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Spots available</p>
                  <p className={"text-sm font-medium " + (program.spots <= 10 ? 'text-red-400' : 'text-green-400')}>{program.spots} spots left</p>
                </div>
              </div>
              <button
                onClick={() => { setSelected(program); setStep('enroll'); }}
                className="w-full py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors"
              >
                Enroll Now
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Corporate & Group Training</h3>
          <p className="text-gray-400 text-sm mb-6 max-w-xl mx-auto">Training your team or organization? We offer custom programs for groups of 10 or more, tailored to your specific needs and schedule.</p>
          <button onClick={() => window.location.href = 'mailto:enroll@aureotrackacademy.com'} className="px-8 py-3 bg-white text-black rounded-xl text-sm font-bold hover:bg-gray-100 transition-colors">
            Contact Us for Group Training
          </button>
        </div>
      </div>
    </div>
  );
}