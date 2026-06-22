'use client';

import { useState, useEffect, useRef } from 'react';

export default function ResetPassword() {
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<'code' | 'password'>('code');
  const [verifiedCode, setVerifiedCode] = useState('');
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get('userId');
    const em = params.get('email');
    if (!uid) { window.location.href = '/forgot-password'; return; }
    setUserId(uid);
    setEmail(em);
  }, []);

  const handleInput = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputs.current[index + 1]?.focus();
    if (newCode.every(d => d !== '') && newCode.join('').length === 6) {
      handleVerifyCode(newCode.join(''));
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
      handleVerifyCode(pasted);
    }
  };

  const handleVerifyCode = async (codeStr: string) => {
    if (codeStr.length !== 6 || !userId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: codeStr, newPassword: 'VERIFY_ONLY_placeholder123' }),
      });
      const data = await res.json();
      if (data.error === 'Password must be at least 8 characters' || data.success) {
        setVerifiedCode(codeStr);
        setStep('password');
        setError(null);
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      setError(err.message);
      setCode(['', '', '', '', '', '']);
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) { setError('Please fill in all fields'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match'); return; }
    if (!userId || !verifiedCode) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code: verifiedCode, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess(true);
      setTimeout(() => window.location.href = '/login', 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
            <p className="text-gray-500 text-sm mb-6">Your password has been updated successfully. Redirecting to login...</p>
            <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors">
              Go to Login →
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <button onClick={() => window.location.href = '/'} className="inline-flex items-center gap-2 bg-transparent border-0 cursor-pointer mb-6">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-10 h-10 rounded-xl object-cover" />
              <span className="font-bold text-xl text-gray-900">AureoTrack</span>
            </button>

            {step === 'code' ? (
              <>
                <div className="w-16 h-16 bg-yellow-50 border-2 border-yellow-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔐</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Enter reset code</h1>
                <p className="text-gray-500 text-sm">
                  Enter the 6-digit code sent to<br />
                  <span className="font-semibold text-gray-700">{email}</span>
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🔒</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Set new password</h1>
                <p className="text-gray-500 text-sm">Choose a strong password for your account</p>
              </>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6 font-medium text-center">
              {error}
            </div>
          )}

          {step === 'code' && (
            <div>
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
                onClick={() => handleVerifyCode(code.join(''))}
                disabled={loading || code.join('').length !== 6}
                className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Code →'}
              </button>
            </div>
          )}

          {step === 'password' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full px-4 py-3.5 bg-white border-2 border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-black transition-all font-medium pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-sm font-medium">
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
                {newPassword && (
                  <div className="mt-2 flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={"h-1 flex-1 rounded-full " + (
                        newPassword.length >= i * 3 ? (newPassword.length >= 12 ? 'bg-green-500' : newPassword.length >= 8 ? 'bg-yellow-500' : 'bg-red-400') : 'bg-gray-200'
                      )} />
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className={"w-full px-4 py-3.5 bg-white border-2 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all font-medium pr-12 " + (
                      confirmPassword && confirmPassword !== newPassword ? 'border-red-300' : confirmPassword && confirmPassword === newPassword ? 'border-green-400' : 'border-gray-200 focus:border-black'
                    )}
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer text-sm font-medium">
                    {showConfirm ? 'Hide' : 'Show'}
                  </button>
                </div>
                {confirmPassword && confirmPassword === newPassword && (
                  <p className="text-green-500 text-xs mt-1">✓ Passwords match</p>
                )}
                {confirmPassword && confirmPassword !== newPassword && (
                  <p className="text-red-400 text-xs mt-1">✗ Passwords do not match</p>
                )}
              </div>

              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3.5 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                {loading ? 'Resetting password...' : 'Reset Password →'}
              </button>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <button onClick={() => window.location.href = '/login'} className="text-sm text-gray-500 hover:text-gray-700 bg-transparent border-0 cursor-pointer">
              ← Back to login
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}