'use client';

import { useState, useEffect } from 'react';
import Nav from '../components/Nav';

const SCHOOLS = [
  {
    id: 'Beginner',
    title: 'Beginner School',
    description: 'Start here. Learn the foundations of financial markets from scratch.',
    icon: '🎓',
    badge: 'Level 1',
    banner: '/academy/trading-basics.svg',
  },
  {
    id: 'Forex',
    title: 'Forex Academy',
    description: 'Master currency trading from beginner to advanced smart money concepts.',
    icon: '💱',
    badge: 'Level 2',
    banner: '/academy/technical-analysis.svg',
  },
  {
    id: 'Crypto',
    title: 'Crypto Academy',
    description: 'Blockchain, DeFi, on-chain analysis, and advanced crypto trading.',
    icon: '₿',
    badge: 'Level 2',
    banner: '/academy/trading-basics.svg',
  },
  {
    id: 'Technical Analysis',
    title: 'Technical Analysis Academy',
    description: 'Candlesticks, chart patterns, indicators, and price action mastery.',
    icon: '📊',
    badge: 'Level 3',
    banner: '/academy/technical-analysis.svg',
  },
  {
    id: 'Risk Management',
    title: 'Risk Management Academy',
    description: 'Position sizing, stop losses, R:R ratio, and portfolio protection.',
    icon: '🛡️',
    badge: 'Level 3',
    banner: '/academy/risk-management.svg',
  },
  {
    id: 'Psychology',
    title: 'Trading Psychology Academy',
    description: 'Fear, greed, FOMO, discipline, and emotional mastery.',
    icon: '🧠',
    badge: 'Level 4',
    banner: '/academy/market-psychology.svg',
  },
];

export default function Academy() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'schools' | 'certifications' | 'community' | 'mentor'>('schools');
  const [selectedSchool, setSelectedSchool] = useState<any>(null);
  const [selectedLesson, setSelectedLesson] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [lesson, setLesson] = useState<any>(null);
  const [loadingLesson, setLoadingLesson] = useState(false);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [mentorData, setMentorData] = useState<any>(null);
  const [loadingMentor, setLoadingMentor] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);
  const [communityRoom, setCommunityRoom] = useState('Crypto');
  const [postContent, setPostContent] = useState('');
  const [posting, setPosting] = useState(false);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [certEarned, setCertEarned] = useState<any>(null);

  const ROOMS = ['Forex', 'Crypto', 'Gold', 'Technical Analysis', 'Market News'];

  useEffect(() => {
    const stored = localStorage.getItem('aureotrack_user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (selectedSchool && user) fetchCourses(selectedSchool.id);
  }, [selectedSchool, user]);

  useEffect(() => {
    if (activeTab === 'certifications' && user) fetchCertifications();
    if (activeTab === 'community') fetchCommunity(communityRoom);
    if (activeTab === 'mentor' && user) fetchMentor();
  }, [activeTab, user]);

  useEffect(() => {
    if (activeTab === 'community') fetchCommunity(communityRoom);
  }, [communityRoom]);

  const fetchCourses = async (school: string) => {
    try {
      const url = user ? `/api/academy/progress?userId=${user.id}&school=${encodeURIComponent(school)}` : `/api/academy/progress?userId=none&school=${encodeURIComponent(school)}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) setCourses(data.courses);
    } catch {}
  };

  const fetchCertifications = async () => {
    try {
      const res = await fetch(`/api/academy/certifications?userId=${user.id}`);
      const data = await res.json();
      if (data.success) setCertifications(data.certifications);
    } catch {}
  };

  const fetchMentor = async () => {
    setLoadingMentor(true);
    try {
      const res = await fetch(`/api/academy/mentor?userId=${user.id}`);
      const data = await res.json();
      if (data.success) setMentorData(data);
    } catch {} finally {
      setLoadingMentor(false);
    }
  };

  const fetchCommunity = async (room: string) => {
    try {
      const res = await fetch(`/api/community?room=${encodeURIComponent(room)}`);
      const data = await res.json();
      if (data.success) setCommunityPosts(data.posts);
    } catch {}
  };

 const handleSelectLesson = async (course: any) => {
    setSelectedLesson(course);
    setLesson(null);
    setSelectedQuizOption(null);
    setQuizSubmitted(false);
    setCertEarned(null);
    setLoadingLesson(true);
    try {
      const res = await fetch('/api/academy/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: course.title, category: course.school, courseId: course.id }),
      });
      const data = await res.json();
      if (data.success) setLesson(data.lesson);
      else setError('Failed to load lesson. Please try again.');
    } catch {
      setError('Failed to load lesson. Please check your connection and try again.');
    } finally {
      setLoadingLesson(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!user || !selectedLesson) return;
    await fetch('/api/academy/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, courseId: selectedLesson.id }),
    });
    fetchCourses(selectedSchool.id);
  };

  const handleQuizSubmit = async (optionIndex: number) => {
    if (quizSubmitted || !lesson?.quizQuestion) return;
    setSelectedQuizOption(optionIndex);
    setQuizSubmitted(true);
    const isCorrect = optionIndex === lesson.quizQuestion.correctIndex;
    const score = isCorrect ? 1 : 0;

    if (user && selectedLesson) {
      const res = await fetch('/api/academy/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, courseId: selectedLesson.id, score, total: 1 }),
      });
      const data = await res.json();
      if (data.certEarned) setCertEarned(data.certEarned);
      fetchCourses(selectedSchool.id);
    }
  };

  const handlePost = async () => {
    if (!user || !postContent.trim()) return;
    setPosting(true);
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, room: communityRoom, content: postContent }),
      });
      const data = await res.json();
      if (data.success) {
        setPostContent('');
        fetchCommunity(communityRoom);
      }
    } catch {} finally {
      setPosting(false);
    }
  };

  const handleAskAssistant = async () => {
    if (!chatInput.trim()) return;
    const userMessage = { role: 'user', content: chatInput };
    const newMessages = [...chatMessages, userMessage];
    setChatMessages(newMessages);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await fetch('/api/academy/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: chatInput, history: chatMessages }),
      });
      const data = await res.json();
      if (data.success) setChatMessages([...newMessages, { role: 'assistant', content: data.answer }]);
    } catch {} finally {
      setChatLoading(false);
    }
  };

  if (selectedLesson && loadingLesson) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
        <header className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => { setSelectedLesson(null); setLesson(null); setLoadingLesson(false); }} className="text-sm text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer">
              ← Back to {selectedSchool?.title}
            </button>
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-6" />
          <h3 className="text-white font-semibold mb-2">Loading Lesson...</h3>
          <p className="text-gray-500 text-sm max-w-xs">AI is preparing your lesson on <span className="text-yellow-400">"{selectedLesson.title}"</span>. This may take up to 15 seconds on first load.</p>
          <p className="text-gray-600 text-xs mt-3">Subsequent loads will be instant — lessons are cached after first generation.</p>
        </div>
      </main>
    );
  }

  if (selectedLesson && !lesson && !loadingLesson) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white flex flex-col">
        <header className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => { setSelectedLesson(null); setLesson(null); }} className="text-sm text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer">
              ← Back to {selectedSchool?.title}
            </button>
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
          </div>
        </header>
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 text-center">
          <p className="text-4xl mb-4">⚠️</p>
          <h3 className="text-white font-semibold mb-2">Failed to Load Lesson</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-xs">{error || 'Something went wrong. Please check your connection and try again.'}</p>
          <div className="flex gap-3">
            <button onClick={() => handleSelectLesson(selectedLesson)} className="px-5 py-2.5 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Try Again
            </button>
            <button onClick={() => { setSelectedLesson(null); setLesson(null); setError(null); }} className="px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
              Go Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (selectedLesson && lesson) {
    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white">
        <header className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => { setSelectedLesson(null); setLesson(null); }} className="text-sm text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer">
              ← Back to {selectedSchool?.title}
            </button>
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 py-8">
          {certEarned && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 mb-6 text-center">
              <p className="text-3xl mb-2">🏆</p>
              <h3 className="font-bold text-yellow-400 text-lg">Certificate Earned!</h3>
              <p className="text-yellow-300 text-sm">You completed the {certEarned.school} school</p>
              <p className="text-yellow-500/70 text-xs mt-1">Certificate ID: {certEarned.certificate_id}</p>
            </div>
          )}

          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">{selectedLesson.school}</span>
              <span className="text-xs text-gray-700">·</span>
              <span className={"text-xs px-2 py-0.5 rounded-full " + (selectedLesson.level === 'Beginner' ? 'bg-blue-400/10 text-blue-400' : selectedLesson.level === 'Intermediate' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400')}>
                {selectedLesson.level}
              </span>
              {selectedLesson.completed && <span className="text-xs px-2 py-0.5 rounded-full bg-green-400/10 text-green-400">✓ Completed</span>}
            </div>
            <h1 className="text-2xl font-bold text-white mb-4">{lesson.title}</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">{lesson.introduction}</p>
            <div className="space-y-6 mb-8">
              {lesson.sections.map((section: any, i: number) => (
                <div key={i}>
                  <h3 className="font-semibold text-white mb-2">{section.heading}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
                </div>
              ))}
            </div>
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-5 mb-6">
              <p className="text-sm font-semibold text-yellow-400 mb-3">Key Takeaways</p>
              <ul className="space-y-2">
                {lesson.keyTakeaways.map((t: string, i: number) => (
                  <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">✓</span> {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {lesson.quizQuestion && (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6">
              <h3 className="font-semibold text-white mb-4">Quiz: {lesson.quizQuestion.question}</h3>
              <div className="space-y-2">
                {lesson.quizQuestion.options.map((opt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleQuizSubmit(i)}
                    disabled={quizSubmitted}
                    className={"w-full text-left px-4 py-3 rounded-xl text-sm border transition-colors " + (
                      !quizSubmitted ? 'border-white/10 hover:bg-white/5 cursor-pointer text-gray-300' :
                      i === lesson.quizQuestion.correctIndex ? 'border-green-400/30 bg-green-400/10 text-green-400' :
                      i === selectedQuizOption ? 'border-red-400/30 bg-red-400/10 text-red-400' : 'border-white/10 opacity-50 text-gray-400'
                    )}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {quizSubmitted && (
                <p className={"text-sm mt-3 font-medium " + (selectedQuizOption === lesson.quizQuestion.correctIndex ? 'text-green-400' : 'text-red-400')}>
                  {selectedQuizOption === lesson.quizQuestion.correctIndex ? '✓ Correct! Lesson marked as complete.' : '✗ Incorrect. Review the lesson and try again.'}
                </p>
              )}
            </div>
          )}

          {user && (
            <button onClick={handleMarkComplete} className="w-full py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Mark as Complete
            </button>
          )}
        </div>
      </main>
    );
  }

  if (selectedSchool) {
    const schoolCourses = courses;
    const levels = [...new Set(schoolCourses.map(c => c.level))];
    const completed = schoolCourses.filter(c => c.completed).length;
    const progress = schoolCourses.length > 0 ? (completed / schoolCourses.length) * 100 : 0;

    return (
      <main className="min-h-screen bg-[#0d0d0d] text-white">
        <header className="bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <button onClick={() => setSelectedSchool(null)} className="text-sm text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer">
              ← Back to AureoAcademy
            </button>
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
          </div>
        </header>

        <div className="h-48 overflow-hidden">
          <img src={selectedSchool.banner} alt={selectedSchool.title} className="w-full h-full object-cover" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
            <div>
              <span className="text-2xl mr-2">{selectedSchool.icon}</span>
              <h1 className="text-2xl font-bold text-white inline">{selectedSchool.title}</h1>
              <p className="text-gray-500 text-sm mt-2">{selectedSchool.description}</p>
            </div>
            <span className="px-3 py-1 bg-yellow-500 text-black rounded-full text-xs font-medium">{selectedSchool.badge}</span>
          </div>

          {user && (
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Your Progress</span>
                <span className="font-medium text-white">{completed}/{schoolCourses.length} lessons</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-500 rounded-full transition-all" style={{ width: progress + '%' }} />
              </div>
            </div>
          )}

          {levels.map(level => (
            <div key={level} className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className={"px-3 py-1 rounded-full text-xs font-medium " + (level === 'Beginner' ? 'bg-blue-400/10 text-blue-400' : level === 'Intermediate' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-400')}>
                  {level}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {schoolCourses.filter(c => c.level === level).map(course => (
                  <button
                    key={course.id}
                    onClick={() => handleSelectLesson(course)}
                    className={"text-left px-5 py-4 bg-white/5 border rounded-xl hover:border-white/30 hover:bg-white/8 transition-colors " + (course.completed ? 'border-green-400/30' : 'border-white/10')}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium text-white">{course.title}</p>
                      {course.completed && <span className="text-green-400 text-xs">✓</span>}
                    </div>
                    <p className="text-xs text-gray-500">{course.description || 'AI-generated lesson · Includes quiz'}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-white">
      <Nav active="AureoAcademy" />

      <div className="bg-black border-b border-white/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-16 h-16 rounded-2xl mx-auto mb-6 object-cover" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-white">AureoAcademy</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">World-class trading education across 6 specialized schools. Learn, practice, get certified.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => setActiveTab('schools')} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">Start Learning</button>
            <button onClick={() => setActiveTab('certifications')} className="px-6 py-3 border border-white/20 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">View Certifications</button>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border-b border-white/10 py-6 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[{ label: 'Schools', value: '6' }, { label: 'Lessons', value: '60+' }, { label: 'Certificates', value: '6' }, { label: 'AI-Powered', value: '100%' }].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {['schools', 'certifications', 'community', 'mentor'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab as any)} className={"px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors " + (activeTab === tab ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10')}>
              {tab === 'mentor' ? '🤖 AI Mentor' : tab === 'schools' ? '📚 Schools' : tab === 'certifications' ? '🏆 Certifications' : '💬 Community'}
            </button>
          ))}
        </div>

        {activeTab === 'schools' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SCHOOLS.map(school => (
              <button key={school.id} onClick={() => setSelectedSchool(school)} className="text-left bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 hover:bg-white/8 transition-all">
                <div className="h-36 overflow-hidden">
                  <img src={school.banner} alt={school.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{school.icon}</span>
                    <span className="text-xs px-2 py-0.5 bg-yellow-500 text-black rounded-full font-medium">{school.badge}</span>
                  </div>
                  <h3 className="font-bold text-white mb-1">{school.title}</h3>
                  <p className="text-sm text-gray-500">{school.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'certifications' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-6">Your Certifications</h2>
            {!user ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-500 mb-4">Login to track your certifications</p>
                <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold">Login</button>
              </div>
            ) : certifications.length === 0 ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-4xl mb-3">🎓</p>
                <p className="text-gray-400 mb-2">No certificates yet</p>
                <p className="text-gray-600 text-sm">Complete all lessons in a school to earn your certificate</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {certifications.map((cert, i) => (
                  <div key={i} className="bg-white/5 border border-yellow-500/30 rounded-2xl p-6 text-center">
                    <p className="text-4xl mb-3">🏆</p>
                    <h3 className="font-bold text-white text-lg">{cert.school} Certificate</h3>
                    <p className="text-sm text-gray-500 mb-3">{cert.level}</p>
                    <p className="text-xs text-gray-600 font-mono">{cert.certificate_id}</p>
                    <p className="text-xs text-gray-600 mt-1">Issued {new Date(cert.issued_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'community' && (
          <div>
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
              {ROOMS.map(room => (
                <button key={room} onClick={() => setCommunityRoom(room)} className={"px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors " + (communityRoom === room ? 'bg-yellow-500 text-black' : 'bg-white/5 border border-white/10 text-gray-400 hover:text-white')}>
                  {room}
                </button>
              ))}
            </div>

            {user && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                <textarea
                  value={postContent}
                  onChange={e => setPostContent(e.target.value)}
                  placeholder={`Share a market insight in #${communityRoom}...`}
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

            <div className="space-y-3">
              {communityPosts.length === 0 ? (
                <div className="text-center py-16 bg-white/5 border border-white/10 rounded-2xl">
                  <p className="text-gray-500">No posts yet in #{communityRoom}. Be the first!</p>
                </div>
              ) : communityPosts.map((post, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/30 rounded-full flex items-center justify-center">
                      <span className="text-yellow-400 text-xs font-bold">{post.users?.full_name?.[0] || 'A'}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{post.users?.full_name || 'Anonymous'}</p>
                      <p className="text-xs text-gray-600">{new Date(post.created_at).toLocaleString()}</p>
                    </div>
                    {post.is_analyst && <span className="ml-auto px-2 py-0.5 bg-yellow-400/10 text-yellow-400 rounded-full text-xs font-medium border border-yellow-400/20">Analyst</span>}
                  </div>
                  <p className="text-sm text-gray-300">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'mentor' && (
          <div>
            <h2 className="text-xl font-bold text-white mb-2">AI Mentor</h2>
            <p className="text-gray-500 text-sm mb-6">Your personalized learning guide based on your progress and trading performance.</p>
            {!user ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-2xl">
                <p className="text-gray-500 mb-4">Login to get personalized AI mentoring</p>
                <button onClick={() => window.location.href = '/login'} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold">Login</button>
              </div>
            ) : loadingMentor ? (
              <div className="text-center py-20">
                <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-gray-500 text-sm">AI Mentor is analyzing your profile...</p>
              </div>
            ) : mentorData ? (
              <div className="space-y-5">
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-sm font-semibold text-white mb-2">Overall Assessment</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{mentorData.recommendation.assessment}</p>
                  <p className="text-yellow-400 text-sm mt-3 italic">{mentorData.recommendation.motivationalMessage}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="bg-green-400/5 border border-green-400/20 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-green-400 mb-3">Strengths</p>
                    <ul className="space-y-2">
                      {mentorData.recommendation.strengths.map((s: string, i: number) => (
                        <li key={i} className="text-sm text-green-300 flex items-start gap-2"><span>✓</span>{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-red-400/5 border border-red-400/20 rounded-2xl p-5">
                    <p className="text-sm font-semibold text-red-400 mb-3">Areas to Improve</p>
                    <ul className="space-y-2">
                      {mentorData.recommendation.weaknesses.map((w: string, i: number) => (
                        <li key={i} className="text-sm text-red-300 flex items-start gap-2"><span>→</span>{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <p className="text-sm font-semibold text-white mb-3">Next Steps</p>
                  <ul className="space-y-2">
                    {mentorData.recommendation.nextSteps.map((step: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start gap-2">
                        <span className="w-5 h-5 bg-yellow-500 text-black rounded-full flex items-center justify-center text-xs flex-shrink-0 font-bold">{i + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-2xl p-5">
                  <p className="text-sm font-semibold text-yellow-400 mb-1">Recommended Next School</p>
                  <p className="text-yellow-300">{mentorData.recommendation.recommendedSchool}</p>
                  <button onClick={() => { const school = SCHOOLS.find(s => s.id === mentorData.recommendation.recommendedSchool); if (school) { setSelectedSchool(school); setActiveTab('schools'); }}} className="mt-3 px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
                    Go to School →
                  </button>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <div className="bg-black border-t border-white/10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10 text-white">Meet Our Founder</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8 bg-white/5 border border-white/10 rounded-2xl p-8">
            <div className="w-full sm:w-1/2 h-72 rounded-2xl overflow-hidden flex-shrink-0">
              <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-yellow-500 text-sm font-medium mb-2 uppercase tracking-wide">Founder & Head of Education</p>
              <h3 className="text-2xl font-bold text-white mb-3">Glean Moore</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">Glean Moore is the visionary behind AureoTrack Academy — a global trading education platform designed to empower individuals across Asia, Africa, and beyond.</p>
              <p className="text-gray-400 text-sm leading-relaxed">Through live events, AI-powered lessons, and a growing global community, Glean and the AureoTrack team are building the next generation of informed, confident traders.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#0d0d0d] py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Live Events & Community</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden h-64 border border-white/10">
              <img src="/academy/photos/live-event.jpeg" alt="AureoTrack Live Event" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64 border border-white/10">
              <img src="/academy/photos/students-group.jpeg" alt="AureoTrack Students" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#111111] border-t border-white/10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-10">Global Chapters</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Asia Chapter', image: '/academy/photos/asia-chapter.jpeg', desc: 'Empowering traders across Southeast Asia and beyond with world-class financial education.' },
              { title: 'Africa Chapter', image: '/academy/photos/africa-chapter.jpeg', desc: 'Building Africa\'s next generation of financially literate traders and investors.' },
            ].map((chapter, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="h-52 overflow-hidden">
                  <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white mb-2">{chapter.title}</h3>
                  <p className="text-sm text-gray-500">{chapter.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black border-t border-white/10 py-16 px-4 text-center">
        <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-12 h-12 rounded-xl mx-auto mb-4 object-cover" />
        <h2 className="text-2xl font-bold mb-2 text-white">Start your trading journey today</h2>
        <p className="text-gray-400 mb-6">6 schools, 60+ lessons, AI quizzes, certifications — all free.</p>
        <button onClick={() => window.location.href = '/register'} className="px-8 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
          Create Free Account
        </button>
      </div>

      {showAssistant && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm bg-[#1a1a1a] border border-white/10 rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-6 h-6 rounded object-cover" />
              <p className="font-semibold text-white text-sm">AI Learning Assistant</p>
            </div>
            <button onClick={() => setShowAssistant(false)} className="text-gray-500 hover:text-white bg-transparent border-0 cursor-pointer">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111111]">
            {chatMessages.length === 0 && (
              <p className="text-sm text-gray-500">Ask me anything — "What is a liquidity sweep?" or "Explain DeFi"</p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={"inline-block px-3 py-2 rounded-xl text-sm max-w-[85%] " + (msg.role === 'user' ? 'bg-yellow-500 text-black font-medium' : 'bg-white/10 text-gray-200')}>
                  {msg.content}
                </span>
              </div>
            ))}
            {chatLoading && <div className="text-left"><span className="inline-block px-3 py-2 rounded-xl text-sm bg-white/10 text-gray-400">Thinking...</span></div>}
          </div>
          <div className="p-4 border-t border-white/10 flex gap-2">
            <input type="text" value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAskAssistant()} placeholder="Ask a question..." className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50" />
            <button onClick={handleAskAssistant} disabled={chatLoading} className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-50">Send</button>
          </div>
        </div>
      )}
    </main>
  );
}