'use client';

import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Please enter your email address'); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.userId) setUserId(data.userId);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <button onClick={() => window.location.href = '/'} className="inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer mb-6">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-bold text-xl text-gray-900">AureoTrack</span>
            </button>

            {!sent ? (
              <>
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔑</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot your password?</h1>
                <p className="text-gray-500 text-sm">Enter your email and we'll send you a reset code</p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
                <p className="text-gray-500 text-sm">
                  We sent a 6-digit reset code to<br />
                  <span className="font-semibold text-gray-700">{email}</span>
                </p>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6 font-medium text-center">
              {error}
            </div>
          )}

          {!sent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all font-medium"
                />
              </div>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Sending reset code...' : 'Send Reset Code →'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/reset-password?userId=' + userId + '&email=' + encodeURIComponent(email)}
                className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors"
              >
                Enter Reset Code →
              </button>
              <button
                onClick={() => { setSent(false); setError(null); }}
                className="w-full py-3 border border-gray-200 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button
              onClick={() => window.location.href = '/login'}
              className="text-sm text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer"
            >
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}