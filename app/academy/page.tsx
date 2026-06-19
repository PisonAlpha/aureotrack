'use client';

import { useState } from 'react';

const COURSES = [
  {
    category: 'Trading Basics',
    description: 'Learn the fundamentals of markets, orders, and how trading works.',
    banner: '/academy/trading-basics.svg',
    color: 'from-yellow-900/30 to-black',
    lessons: [
      'What is Trading and How Markets Work',
      'Understanding Spot vs Futures Trading',
      'Order Types: Market, Limit, and Stop Orders',
      'How to Read a Price Chart',
    ],
  },
  {
    category: 'Technical Analysis',
    description: 'Master chart patterns, indicators, and price action strategies.',
    banner: '/academy/technical-analysis.svg',
    color: 'from-green-900/30 to-black',
    lessons: [
      'Introduction to Candlestick Charts',
      'Support and Resistance Levels',
      'Understanding RSI and Moving Averages',
      'Identifying Trend Lines and Chart Patterns',
    ],
  },
  {
    category: 'Risk Management',
    description: 'Protect your capital with smart position sizing and stop losses.',
    banner: '/academy/risk-management.svg',
    color: 'from-blue-900/30 to-black',
    lessons: [
      'Position Sizing and Risk Per Trade',
      'How Stop Loss and Take Profit Work',
      'Understanding Leverage and Liquidation',
      'The Risk-Reward Ratio Explained',
    ],
  },
  {
    category: 'Market Psychology',
    description: 'Develop the mindset and discipline of a consistently profitable trader.',
    banner: '/academy/market-psychology.svg',
    color: 'from-purple-900/30 to-black',
    lessons: [
      'Controlling Fear and Greed in Trading',
      'Why Most Traders Lose Money',
      'Building Trading Discipline and Patience',
      'Understanding Market Sentiment and FOMO',
    ],
  },
];

const STAFF = [
  { name: 'Glean Moore', role: 'Founder & Head of Education', image: '/academy/photos/staff-stage.jpeg' },
];

const STUDENTS = [
  { name: 'Asia Chapter Students', quote: 'AureoAcademy is changing how we approach global markets and financial education.', image: '/academy/photos/asia-chapter.jpeg' },
  { name: 'Africa Chapter Students', quote: 'From Africa to the world — AureoAcademy gave us the tools to trade and build wealth.', image: '/academy/photos/africa-chapter.jpeg' },
  { name: 'Global Community', quote: 'The energy at every AureoTrack event is incredible. This is more than education.', image: '/academy/photos/students-group.jpeg' },
];

export default function Academy() {
  const [selectedLesson, setSelectedLesson] = useState<{ topic: string; category: string } | null>(null);
  const [lesson, setLesson] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedQuizOption, setSelectedQuizOption] = useState<number | null>(null);
  const [showAssistant, setShowAssistant] = useState(false);
  const [chatMessages, setChatMessages] = useState<{ role: string; content: string }[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);

  const handleSelectLesson = async (topic: string, category: string) => {
    setSelectedLesson({ topic, category });
    setLesson(null);
    setSelectedQuizOption(null);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/academy/lesson', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, category }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setLesson(data.lesson);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
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
      if (!res.ok) throw new Error(data.error);
      setChatMessages([...newMessages, { role: 'assistant', content: data.answer }]);
    } catch {
      setChatMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (selectedLesson) {
    const course = COURSES.find(c => c.category === selectedLesson.category);
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button onClick={() => setSelectedLesson(null)} className="text-sm text-gray-600 hover:text-gray-900 bg-transparent border-0 cursor-pointer flex items-center gap-2">
              ← Back to AureoAcademy
            </button>
            <button onClick={() => window.location.href = '/'} className="flex items-center gap-2 bg-transparent border-0 cursor-pointer p-0">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-8 h-8 rounded-lg object-cover" />
              <span className="font-bold text-gray-900">AureoAcademy</span>
            </button>
          </div>
        </header>

        {course && (
          <div className="w-full h-48 overflow-hidden">
            <img src={course.banner} alt={course.category} className="w-full h-full object-cover" />
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
          {loading && (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Generating lesson content...</p>
            </div>
          )}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}
          {lesson && (
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
              <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide">{selectedLesson.category}</p>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">{lesson.title}</h1>
              <p className="text-gray-600 mb-8 leading-relaxed">{lesson.introduction}</p>
              <div className="space-y-6 mb-8">
                {lesson.sections.map((section: any, i: number) => (
                  <div key={i}>
                    <h3 className="font-semibold text-gray-900 mb-2">{section.heading}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
                  </div>
                ))}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
                <p className="text-sm font-semibold text-amber-800 mb-3">Key Takeaways</p>
                <ul className="space-y-2">
                  {lesson.keyTakeaways.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-amber-900 flex items-start gap-2">
                      <span className="text-amber-600 font-bold">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>
              {lesson.quizQuestion && (
                <div className="border border-gray-200 rounded-xl p-5">
                  <p className="text-sm font-semibold text-gray-900 mb-4">Quick Check: {lesson.quizQuestion.question}</p>
                  <div className="space-y-2">
                    {lesson.quizQuestion.options.map((opt: string, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedQuizOption(i)}
                        className={"w-full text-left px-4 py-3 rounded-xl text-sm border transition-colors " + (
                          selectedQuizOption === null ? 'border-gray-200 hover:bg-gray-50' :
                          i === lesson.quizQuestion.correctIndex ? 'border-green-300 bg-green-50 text-green-700' :
                          i === selectedQuizOption ? 'border-red-300 bg-red-50 text-red-700' : 'border-gray-200 opacity-50'
                        )}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                  {selectedQuizOption !== null && (
                    <p className="text-sm mt-3 font-medium">
                      {selectedQuizOption === lesson.quizQuestion.correctIndex ? '✓ Correct! Well done.' : '✗ Not quite — review the lesson above.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {showAssistant && (
          <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '500px' }}>
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-6 h-6 rounded object-cover" />
                <p className="font-semibold text-gray-900 text-sm">AI Learning Assistant</p>
              </div>
              <button onClick={() => setShowAssistant(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer">✕</button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {chatMessages.length === 0 && (
                <p className="text-sm text-gray-400">Ask me anything about trading — "What is RSI?" or "Explain leverage risk"</p>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                  <span className={"inline-block px-3 py-2 rounded-xl text-sm max-w-[85%] " + (msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700')}>
                    {msg.content}
                  </span>
                </div>
              ))}
              {chatLoading && (
                <div className="text-left">
                  <span className="inline-block px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400">Thinking...</span>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAskAssistant()}
                placeholder="Ask a question..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button onClick={handleAskAssistant} disabled={chatLoading} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                Send
              </button>
            </div>
          </div>
        )}
        <button
          onClick={() => setShowAssistant(!showAssistant)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition-colors z-40"
          style={{ display: showAssistant ? 'none' : 'flex' }}
        >
          💬
        </button>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-black text-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button onClick={() => window.location.href = '/'} className="flex items-center gap-3 bg-transparent border-0 cursor-pointer p-0">
            <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-9 h-9 rounded-lg object-cover" />
            <span className="font-bold text-white text-lg">AureoAcademy</span>
          </button>
          <nav className="hidden md:flex items-center gap-6">
            {COURSES.map(c => (
              <button key={c.category} onClick={() => setExpandedCourse(c.category)} className="text-sm text-gray-300 hover:text-white bg-transparent border-0 cursor-pointer">{c.category}</button>
            ))}
          </nav>
          <button onClick={() => setShowAssistant(true)} className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
            Ask AI
          </button>
        </div>
      </header>

      <div className="bg-black text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-16 h-16 rounded-2xl mx-auto mb-6 object-cover" />
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">AureoAcademy</h1>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">Free world-class trading education. Learn at your own pace, backed by AI-powered lessons and quizzes.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <button onClick={() => setExpandedCourse('Trading Basics')} className="px-6 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
              Start Learning
            </button>
            <button onClick={() => setShowAssistant(true)} className="px-6 py-3 border border-gray-600 text-white rounded-xl text-sm font-semibold hover:bg-white/10 transition-colors">
              Ask AI Assistant
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white border-b border-gray-200 py-8 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Free Lessons', value: '16+' },
            { label: 'Categories', value: '4' },
            { label: 'AI-Powered', value: '100%' },
            { label: 'Quiz Per Lesson', value: '✓' },
          ].map(stat => (
            <div key={stat.label}>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Courses</h2>
        <div className="space-y-6">
          {COURSES.map(course => (
            <div key={course.category} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
              <div className="h-48 overflow-hidden cursor-pointer" onClick={() => setExpandedCourse(expandedCourse === course.category ? null : course.category)}>
                <img src={course.banner} alt={course.category} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-gray-900 text-lg">{course.category}</h3>
                  <span className="text-xs text-gray-400">{course.lessons.length} lessons</span>
                </div>
                <p className="text-sm text-gray-500 mb-4">{course.description}</p>
                <button
                  onClick={() => setExpandedCourse(expandedCourse === course.category ? null : course.category)}
                  className="text-sm font-medium text-black hover:underline bg-transparent border-0 cursor-pointer"
                >
                  {expandedCourse === course.category ? '▲ Hide lessons' : '▼ View lessons'}
                </button>
                {expandedCourse === course.category && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {course.lessons.map(lesson => (
                      <button
                        key={lesson}
                        onClick={() => handleSelectLesson(lesson, course.category)}
                        className="text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-gray-400 hover:bg-gray-100 transition-colors"
                      >
                        <p className="text-sm font-medium text-gray-900">{lesson}</p>
                        <p className="text-xs text-gray-400 mt-0.5">AI-generated · Includes quiz</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-black text-white py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-10">Meet Our Founder</h2>
          <div className="flex flex-col sm:flex-row items-center gap-8 bg-gray-900 rounded-2xl p-8">
            <div className="w-full sm:w-1/2 h-72 rounded-2xl overflow-hidden flex-shrink-0">
              <img src="/academy/photos/staff-stage.jpeg" alt="Glean Moore" className="w-full h-full object-cover object-top" />
            </div>
            <div>
              <p className="text-yellow-500 text-sm font-medium mb-2 uppercase tracking-wide">Founder & Head of Education</p>
              <h3 className="text-2xl font-bold text-white mb-3">Glean Moore</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Glean Moore is the visionary behind AureoTrack Academy — a global trading education platform designed to empower individuals across Asia, Africa, and beyond to understand markets, build wealth, and achieve financial independence.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed">
                Through live events, AI-powered lessons, and a growing global community, Glean and the AureoTrack team are building the next generation of informed, confident traders.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-900 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-3">Live Events & Community</h2>
          <p className="text-gray-400 text-center text-sm mb-10">AureoTrack brings students and traders together across the globe</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden h-64">
              <img src="/academy/photos/live-event.jpeg" alt="AureoTrack Live Event" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
            <div className="rounded-2xl overflow-hidden h-64">
              <img src="/academy/photos/students-group.jpeg" alt="AureoTrack Students" className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
            </div>
          </div>
        </div>
      </div>
     <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">Global Chapters</h2>
          <p className="text-gray-500 text-center text-sm mb-10">AureoAcademy is present across Asia, Africa, and growing worldwide</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { title: 'Asia Chapter', image: '/academy/photos/asia-chapter.jpeg', desc: 'Empowering traders across Southeast Asia and beyond with world-class financial education.' },
              { title: 'Africa Chapter', image: '/academy/photos/africa-chapter.jpeg', desc: 'Building Africa\'s next generation of financially literate traders and investors.' },
            ].map((chapter, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
                <div className="h-52 overflow-hidden">
                  <img src={chapter.image} alt={chapter.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 mb-2">{chapter.title}</h3>
                  <p className="text-sm text-gray-500">{chapter.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-16 px-4 text-center">
        <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-12 h-12 rounded-xl mx-auto mb-4 object-cover" />
        <h2 className="text-2xl font-bold mb-2">Start your trading journey today</h2>
        <p className="text-gray-400 mb-6">Free lessons, AI quizzes, and an AI assistant — all in one place.</p>
        <button onClick={() => window.location.href = '/register'} className="px-8 py-3 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors">
          Create Free Account
        </button>
      </div>

      {showAssistant && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <img src="/aureotrack-logo.png" alt="AureoTrack" className="w-6 h-6 rounded object-cover" />
              <p className="font-semibold text-gray-900 text-sm">AI Learning Assistant</p>
            </div>
            <button onClick={() => setShowAssistant(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <p className="text-sm text-gray-400">Ask me anything about trading — "What is RSI?" or "Explain leverage risk"</p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={"inline-block px-3 py-2 rounded-xl text-sm max-w-[85%] " + (msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700')}>
                  {msg.content}
                </span>
              </div>
            ))}
            {chatLoading && (
              <div className="text-left">
                <span className="inline-block px-3 py-2 rounded-xl text-sm bg-gray-100 text-gray-400">Thinking...</span>
              </div>
            )}
          </div>
          <div className="p-4 border-t border-gray-200 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAskAssistant()}
              placeholder="Ask a question..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button onClick={handleAskAssistant} disabled={chatLoading} className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
              Send
            </button>
          </div>
        </div>
      )}
      <button
        onClick={() => setShowAssistant(!showAssistant)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg flex items-center justify-center text-2xl hover:bg-gray-800 transition-colors z-40"
        style={{ display: showAssistant ? 'none' : 'flex' }}
      >
        💬
      </button>
    </main>
  );
}