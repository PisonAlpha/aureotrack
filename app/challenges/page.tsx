'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

export default function Challenges() {
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
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
    } catch {} finally {
      setLoading(false);
    }
  };

  const handleJoin = async (challengeId: string) => {
    if (!user) { window.location.href = '/login'; return; }
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
      setSuccess('Successfully joined challenge!');
      fetchChallenges();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setJoining(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoCommunity" />

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Trading Challenges</h1>
          <p className="text-gray-500 text-sm">Test your skills, earn badges, and prove your trading ability</p>
        </div>

        {error && <div className="p-4 bg-red-400/10 border border-red-400/20 rounded-xl text-red-400 text-sm mb-6">{error}</div>}
        {success && <div className="p-4 bg-green-400/10 border border-green-400/20 rounded-xl text-green-400 text-sm mb-6">{success}</div>}

        {!user && (
          <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-6 flex items-center justify-between flex-wrap gap-3">
            <p className="text-sm text-yellow-400">Login to join challenges and track your progress</p>
            <button onClick={() => window.location.href = '/login'} className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Login
            </button>
          </div>
        )}

        {loading ? (
          <div className="text-center py-20">
            <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {challenges.map(challenge => (
              <div key={challenge.id} className={"bg-white/5 border rounded-2xl p-6 " + (challenge.isComplete ? 'border-yellow-500/30' : 'border-white/10')}>
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{challenge.badge_emoji}</span>
                  {challenge.isComplete && (
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 rounded-full text-xs font-medium border border-yellow-500/20">
                      Completed ✓
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-white mb-2">{challenge.title}</h3>
                <p className="text-sm text-gray-400 mb-3 leading-relaxed">{challenge.description}</p>
                <p className="text-xs text-gray-600 mb-4">{challenge.duration_days} day challenge</p>

                {challenge.joined ? (
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-300 font-medium">{challenge.progress.toFixed(0)}%</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={"h-full rounded-full transition-all " + (challenge.isComplete ? 'bg-yellow-500' : 'bg-white/40')}
                        style={{ width: Math.min(100, challenge.progress) + '%' }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      {challenge.isComplete ? 'Challenge completed!' : 'In progress — keep trading to advance'}
                    </p>
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoin(challenge.id)}
                    disabled={joining === challenge.id}
                    className="w-full py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                  >
                    {joining === challenge.id ? 'Joining...' : 'Join Challenge'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="font-semibold text-white mb-4">How Challenges Work</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { step: '1', title: 'Join a Challenge', desc: 'Pick a challenge that matches your skill level and click Join' },
              { step: '2', title: 'Trade on Demo', desc: 'Use the Demo Trading Terminal to work toward your challenge goal' },
              { step: '3', title: 'Earn Your Badge', desc: 'Complete the challenge to earn a badge and appear on the leaderboard' },
            ].map(item => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-white text-sm mb-1">{item.title}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}