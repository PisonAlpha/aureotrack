'use client';

import { useState, useEffect } from 'react';

export default function Challenges() {
  const [user, setUser] = useState<any>(null);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    setCheckedAuth(true);
  }, []);

  useEffect(() => {
    fetchChallenges();
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const url = user ? '/api/challenges?userId=' + user.id : '/api/challenges';
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setChallenges(data.challenges);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challengeId: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setJoining(challengeId);
    setError(null);

    try {
      const res = await fetch('/api/challenges', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, challengeId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      fetchChallenges();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setJoining(null);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">AureoTrack</span>
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Trading Challenges</h1>
          <p className="text-gray-500 text-sm mt-1">Test your skills, earn badges, and track your progress</p>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm mb-6">{error}</div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {challenges.map(challenge => (
              <div key={challenge.id} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl">{challenge.badge_emoji}</span>
                  {challenge.isComplete && (
                    <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-medium">Completed!</span>
                  )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{challenge.description}</p>
                <p className="text-xs text-gray-400 mb-4">{challenge.duration_days} day challenge</p>

                {challenge.joined ? (
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-700 font-medium">{challenge.progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={"h-full rounded-full " + (challenge.isComplete ? 'bg-green-500' : 'bg-black')}
                        style={{ width: Math.min(100, challenge.progress) + '%' }}
                      />
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoin(challenge.id)}
                    disabled={joining === challenge.id}
                    className="w-full py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
                  >
                    {joining === challenge.id ? 'Joining...' : 'Join Challenge'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}