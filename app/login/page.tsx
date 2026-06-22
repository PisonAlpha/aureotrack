'use client';

import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        if (data.needsVerification) {
          window.location.href = '/verify?userId=' + data.userId + '&email=' + encodeURIComponent(data.email);
          return;
        }
        throw new Error(data.error);
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
            The macro and trading<br />intelligence platform.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-8">
            Real-time market data, AI-powered analysis, and a realistic demo trading terminal — all in one place.
          </p>
          <div className="space-y-3">
            {[
              '✓ Live macro & crypto dashboards',
              '✓ AI market intelligence & event simulator',
              '✓ Demo trading with real TradingView charts',
              '✓ Portfolio & risk analytics',
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

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Sign in to your AureoTrack account</p>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6 font-medium">
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleLogin()}
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
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter your password"
                  className={inputClass + " pr-12"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 bg-transparent border-0 cursor-pointer text-sm font-medium"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

           <div className="flex justify-end mb-1">
              <button
                onClick={() => window.location.href = '/forgot-password'}
                className="text-xs text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer"
              >
                Forgot password?
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign in →'}
            </button>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center space-y-3">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <button
                onClick={() => window.location.href = '/register'}
                className="text-black font-bold hover:underline bg-transparent border-0 cursor-pointer"
              >
                Create one free
              </button>
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="text-xs text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer"
            >
              ← Back to AureoTrack
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}