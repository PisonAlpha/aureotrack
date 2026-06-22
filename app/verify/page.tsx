'use client';

import { useState, useEffect, useRef } from 'react';

export default function Verify() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('userId');
    const em = params.get('email');
    if (!uid) { window.location.href = '/register'; return; }
    setUserId(uid);
    setEmail(em);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
    if (newCode.every(d => d !== '') && newCode.join('').length === 6) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      handleVerify(pasted);
    }
  };

  const handleVerify = async (codeStr?: string) => {
    const finalCode = codeStr || code.join('');
    if (finalCode.length !== 6) { setError('Enter the complete 6-digit code'); return; }
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: finalCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      localStorage.setItem('aureotrack_user', JSON.stringify(data.user));
      setSuccess('Email verified! Redirecting...');
      setTimeout(() => window.location.href = '/', 1500);
    } catch (err: any) {
      setError(err.message);
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!userId || !canResend) return;
    setResending(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess('New code sent to your email!');
      setCountdown(60);
      setCanResend(false);
      setCode(['', '', '', '', '', '']);
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setResending(false);
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
            <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📧</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h1>
            <p className="text-gray-500 text-sm">
              We sent a 6-digit verification code to<br />
              <span className="font-semibold text-gray-700">{email || 'your email address'}</span>
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6 font-medium text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm mb-6 font-medium text-center">
              {success}
            </div>
          )}

          <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
            {code.map((digit, i) => (
              <input
                key={i}
                ref={el => { inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleInput(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className={"w-12 h-14 text-center text-xl font-bold border-2 rounded-xl focus:outline-none transition-all text-gray-900 " + (
                  digit ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200 bg-white focus:border-black'
                )}
              />
            ))}
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={loading || code.join('').length !== 6}
            className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50 mb-4"
          >
            {loading ? 'Verifying...' : 'Verify Email →'}
          </button>

          <div className="text-center">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-sm text-black font-semibold hover:underline bg-transparent border-0 cursor-pointer disabled:opacity-50"
              >
                {resending ? 'Sending...' : 'Resend verification code'}
              </button>
            ) : (
              <p className="text-sm text-gray-400">
                Resend code in <span className="font-semibold text-gray-600">{countdown}s</span>
              </p>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">
              Wrong email?{' '}
              <button onClick={() => window.location.href = '/register'} className="text-black font-semibold hover:underline bg-transparent border-0 cursor-pointer text-xs">
                Go back to register
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          Didn't receive an email? Check your spam folder.
        </p>
      </div>
    </main>
  );
}