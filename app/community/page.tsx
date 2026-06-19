'use client';

import { useState, useEffect } from 'react';

export default function Community() {
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [room, setRoom] = useState('Crypto');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [loading, setLoading] = useState(true);

  const ROOMS = ['Forex', 'Crypto', 'Gold', 'Technical Analysis', 'Market News'];

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
    fetchPosts('Crypto');
  }, []);

  useEffect(() => {
    fetchPosts(room);
  }, [room]);

  const fetchPosts = async (r: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/community?room=' + encodeURIComponent(r));
      const data = await res.json();
      if (data.success) setPosts(data.posts);
    } catch {} finally {
      setLoading(false);
    }
  };

  const handlePost = async () => {
    if (!user || !postContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, room, content: postContent }),
      });
      const data = await res.json();
      if (data.success) {
        setPostContent('');
        fetchPosts(room);
      }
    } catch {} finally {
      setPosting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <header className="border-b border-white/10 sticky top-0 z-50 bg-[#0d0d0d]/95 backdrop-blur">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
            <span className="font-bold text-white">AureoCommunity</span>
          </button>
          <nav className="hidden md:flex items-center gap-1">
            {[['/', 'Intelligence'], ['/trade', 'AureoTrade'], ['/academy', 'AureoAcademy'], ['/auroai', 'AureoAI'], ['/community', 'Community']].map(([href, label]) => (
              <button key={label} onClick={() => window.location.href = href} className={"px-3 py-1.5 rounded-lg text-sm transition-colors bg-transparent border-0 cursor-pointer " + (href === '/community' ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5')}>
                {label}
              </button>
            ))}
          </nav>
          {user ? (
            <span className="text-sm text-gray-400">{user.full_name}</span>
          ) : (
            <button onClick={() => window.location.href = '/login'} className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Sign in
            </button>
          )}
        </div>
      </header>

      <div className="bg-black py-12 px-4 text-center border-b border-white/10">
        <h1 className="text-3xl font-bold text-white mb-2">AureoCommunity</h1>
        <p className="text-gray-400 text-sm">Connect with traders, share insights, and compete on the leaderboard</p>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-5 overflow-x-auto pb-2">
              {ROOMS.map(r => (
                <button key={r} onClick={() => setRoom(r)} className={"px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors " + (room === r ? 'bg-white text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white')}>
                  {r}
                </button>
              ))}
            </div>

            {user && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-5">
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder={`Share a market insight in #${room}...`}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50 resize-none"
                  rows={3}
                />
                <div className="flex justify-end mt-2">
                  <button onClick={handlePost} disabled={posting || !postContent.trim()} className="px-5 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50">
                    {posting ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            )}

            {loading ? (
              <div className="text-center py-12">
                <div className="w-6 h-6 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-500">No posts yet in #{room}. Be the first to share!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {posts.map((post, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-yellow-400 text-xs font-bold">{post.users?.full_name?.[0] || 'A'}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-white">{post.users?.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-gray-600">{new Date(post.created_at).toLocaleString()}</p>
                      </div>
                      {post.is_analyst && <span className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 rounded-full text-xs border border-yellow-500/20">Analyst</span>}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed">{post.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-4">Quick Links</h3>
              <div className="space-y-2">
                {[
                  { label: '🏆 Leaderboard', href: '/leaderboard' },
                  { label: '🎯 Challenges', href: '/challenges' },
                  { label: '📚 AureoAcademy', href: '/academy' },
                  { label: '📈 Demo Trading', href: '/trade' },
                ].map(link => (
                  <button key={link.label} onClick={() => window.location.href = link.href} className="w-full text-left px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors">
                    {link.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="font-semibold text-white mb-3">Community Rules</h3>
              <ul className="space-y-2 text-xs text-gray-500">
                {['Share market insights and analysis', 'Be respectful to all members', 'No spam or promotional content', 'Label opinions clearly as opinions', 'Support fellow learners'].map((rule, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-yellow-500">•</span>{rule}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}