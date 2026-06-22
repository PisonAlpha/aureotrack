'use client';

import { useState } from 'react';

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [startingBalance, setStartingBalance] = useState('100000');
  const [customBalance, setCustomBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirm) {
      setError('Please fill in all fields');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const finalBalance = startingBalance === 'custom'
        ? parseFloat(customBalance) || 100000
        : parseFloat(startingBalance);

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, full_name: fullName, starting_balance: finalBalance }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.needsVerification) {
          window.location.href = '/verify?userId=' + data.userId + '&email=' + encodeURIComponent(email);
          return;
        }
        throw new Error(data.error);
      }

      if (data.needsVerification) {
        window.location.href = '/verify?userId=' + data.userId + '&email=' + encodeURIComponent(email);
        return;
      }

      localStorage.setItem('aureotrack_user', JSON.stringify(data.user));
      window.location.href = '/';
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all font-medium";

  return (
    <main className="min-h-screen bg-gray-50 flex">
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-12">
        <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
          <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-9 h-9 rounded-lg object-cover" />
          <span className="font-bold text-white text-lg">AureoTrack</span>
        </button>
        <div>
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
            Learn markets.<br />Trade smarter.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Choose your starting balance, get real-time market data, and AI-powered insights — completely free.
          </p>
          <div className="space-y-3">
            {[
              '✓ Choose your own demo trading balance',
              '✓ Real-time crypto & macro data',
              '✓ AI market analysis & event simulator',
              '✓ Full AureoAcademy access — 60+ lessons',
              '✓ TGE airdrop whitelist eligibility',
            ].map(item => (
              <p key={item} className="text-gray-300 text-sm">{item}</p>
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-xs">© 2026 AureoTrack. Macro & Trading Intelligence.</p>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-md">
          <div className="lg:hidden text-center mb-8">
            <button onClick={() => window.location.href = '/'} className="inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-bold text-xl text-gray-900">AureoTrack</span>
            </button>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Choose your starting demo balance and start trading</p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Full name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="John Doe"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className={inputClass + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-sm"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {password && (
                <div className="mt-2 flex gap-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={"h-1 flex-1 rounded-full " + (
                      password.length >= i * 3 ? (password.length >= 12 ? 'bg-green-500' : password.length >= 8 ? 'bg-yellow-500' : 'bg-red-400') : 'bg-gray-200'
                    )} />
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirm}
                  onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat your password"
                  className={inputClass + " pr-12" + (confirm && confirm !== password ? " border-red-300" : confirm && confirm === password ? " border-green-400" : "")}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-sm"
                >
                  {showConfirm ? 'Hide' : 'Show'}
                </button>
              </div>
              {confirm && confirm === password && (
                <p className="text-green-500 text-xs mt-1">✓ Passwords match</p>
              )}
              {confirm && confirm !== password && (
                <p className="text-red-400 text-xs mt-1">✗ Passwords do not match</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Starting demo balance</label>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {[
                  { label: '$10,000', value: '10000' },
                  { label: '$100,000', value: '100000' },
                  { label: 'Custom', value: 'custom' },
                ].map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setStartingBalance(opt.value)}
                    className={"py-2.5 rounded-xl text-sm font-semibold transition-colors " + (
                      startingBalance === opt.value ? 'bg-black text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              {startingBalance === 'custom' && (
                <input
                  type="number"
                  value={customBalance}
                  onChange={e => setCustomBalance(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleRegister()}
                  placeholder="Enter amount e.g. 50000"
                  className={inputClass}
                />
              )}
            </div>

            <button
              onClick={handleRegister}
              disabled={loading}
              className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating account & sending code...' : 'Create free account →'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <button
                onClick={() => window.location.href = '/login'}
                className="text-black font-bold hover:underline bg-transparent border-0 cursor-pointer"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}