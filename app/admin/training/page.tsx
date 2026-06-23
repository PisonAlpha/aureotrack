'use client';

import { useState, useEffect } from 'react';

export default function AdminTraining() {
  const [adminKey, setAdminKey] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid'>('all');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string>>({});

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/training?adminKey=' + adminKey);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setEnrollments(data.enrollments);
      setAuthenticated(true);
    } catch (err: any) {
      setError('Invalid admin key');
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrollments = async () => {
    try {
      const res = await fetch('/api/training?adminKey=' + adminKey);
      const data = await res.json();
      if (data.success) setEnrollments(data.enrollments);
    } catch {}
  };

  const handleMarkPaid = async (enrollmentId: string, paid: boolean) => {
    setUpdatingId(enrollmentId);
    try {
      const res = await fetch('/api/training', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          enrollmentId,
          paid,
          status: paid ? 'paid' : 'pending',
          notes: notes[enrollmentId] || undefined,
          adminKey,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchEnrollments();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = enrollments.filter(e => {
    if (filter === 'paid') return e.paid;
    if (filter === 'pending') return !e.paid;
    return true;
  });

  const totalRevenue = enrollments
    .filter(e => e.paid)
    .reduce((sum, e) => sum + parseFloat(e.program_price.replace('$', '')), 0);

  if (!authenticated) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-12 h-12 rounded-xl mx-auto mb-4 object-cover" />
              <h1 className="text-2xl font-bold text-white mb-1">Admin Dashboard</h1>
              <p className="text-gray-500 text-sm">Training Enrollment Management</p>
            </div>

            {error && <div className="p-3 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-4 text-center">{error}</div>}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Admin Key</label>
                <input
                  type="password"
                  value={adminKey}
                  onChange={e => setAdminKey(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                  placeholder="Enter admin key"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading || !adminKey}
                className="w-full py-3 bg-yellow-500 text-black rounded-xl text-sm font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard →'}
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <header className="border-b border-white/10 bg-[#0a0a0a] px-4 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
            <div>
              <p className="font-bold text-white">Admin Dashboard</p>
              <p className="text-xs text-gray-500">Training Enrollment Management</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchEnrollments} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors">
              Refresh
            </button>
            <button onClick={() => window.location.href = '/'} className="px-4 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/10 transition-colors">
              ← Back to Site
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Enrollments', value: enrollments.length, color: 'text-white' },
            { label: 'Paid', value: enrollments.filter(e => e.paid).length, color: 'text-green-400' },
            { label: 'Pending Payment', value: enrollments.filter(e => !e.paid).length, color: 'text-yellow-400' },
            { label: 'Total Revenue', value: '$' + totalRevenue.toLocaleString(), color: 'text-yellow-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
              <p className={"text-2xl font-bold " + stat.color}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'paid'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} className={"px-4 py-2 rounded-xl text-sm font-medium capitalize transition-colors " + (filter === f ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white')}>
              {f} {f === 'all' ? `(${enrollments.length})` : f === 'paid' ? `(${enrollments.filter(e => e.paid).length})` : `(${enrollments.filter(e => !e.paid).length})`}
            </button>
          ))}
        </div>

        {error && <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>}

        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
            <p className="text-gray-500">No enrollments found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(enrollment => (
              <div key={enrollment.id} className={"bg-white/5 border rounded-2xl p-6 " + (enrollment.paid ? 'border-green-500/20' : 'border-white/10')}>
                <div className="flex items-start justify-between flex-wrap gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-white">{enrollment.full_name}</h3>
                      <span className={"px-2 py-0.5 rounded-full text-xs font-medium " + (enrollment.paid ? 'bg-green-400/10 text-green-400 border border-green-400/20' : 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20')}>
                        {enrollment.paid ? '✓ Paid' : 'Pending Payment'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400">{enrollment.email} {enrollment.phone && `· ${enrollment.phone}`}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-yellow-400 font-bold">{enrollment.program_price}</p>
                    <p className="text-xs text-gray-500">{new Date(enrollment.created_at).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Program</p>
                    <p className="text-sm font-medium text-white">{enrollment.program_title}</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-xs text-gray-500 mb-1">Experience Level</p>
                    <p className="text-sm text-gray-300">{enrollment.experience || '—'}</p>
                  </div>
                </div>

                {enrollment.goals && (
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-4">
                    <p className="text-xs text-gray-500 mb-1">Goals</p>
                    <p className="text-sm text-gray-300">{enrollment.goals}</p>
                  </div>
                )}

                <div className="mb-4">
                  <label className="block text-xs text-gray-500 mb-2">Admin Notes</label>
                  <input
                    type="text"
                    value={notes[enrollment.id] || enrollment.notes || ''}
                    onChange={e => setNotes(prev => ({ ...prev, [enrollment.id]: e.target.value }))}
                    placeholder="Add notes about payment, communication, etc..."
                    className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                  />
                </div>

                <div className="flex gap-3 flex-wrap">
                  {!enrollment.paid ? (
                    <button
                      onClick={() => handleMarkPaid(enrollment.id, true)}
                      disabled={updatingId === enrollment.id}
                      className="px-5 py-2 bg-green-500 text-black rounded-xl text-sm font-semibold hover:bg-green-400 transition-colors disabled:opacity-50"
                    >
                      {updatingId === enrollment.id ? 'Updating...' : '✓ Mark as Paid'}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleMarkPaid(enrollment.id, false)}
                      disabled={updatingId === enrollment.id}
                      className="px-5 py-2 bg-white/10 border border-white/20 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors disabled:opacity-50"
                    >
                      {updatingId === enrollment.id ? 'Updating...' : 'Mark as Unpaid'}
                    </button>
                  )}
                  <button
                    onClick={() => window.location.href = 'mailto:' + enrollment.email}
                    className="px-5 py-2 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
                  >
                    Email Student →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}