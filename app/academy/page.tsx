'use client';

import { useState } from 'react';

const COURSES = [
  {
    category: 'Trading Basics',
    lessons: [
      'What is Trading and How Markets Work',
      'Understanding Spot vs Futures Trading',
      'Order Types: Market, Limit, and Stop Orders',
      'How to Read a Price Chart',
    ],
  },
  {
    category: 'Technical Analysis',
    lessons: [
      'Introduction to Candlestick Charts',
      'Support and Resistance Levels',
      'Understanding RSI and Moving Averages',
      'Identifying Trend Lines and Chart Patterns',
    ],
  },
  {
    category: 'Risk Management',
    lessons: [
      'Position Sizing and Risk Per Trade',
      'How Stop Loss and Take Profit Work',
      'Understanding Leverage and Liquidation',
      'The Risk-Reward Ratio Explained',
    ],
  },
  {
    category: 'Market Psychology',
    lessons: [
      'Controlling Fear and Greed in Trading',
      'Why Most Traders Lose Money',
      'Building Trading Discipline and Patience',
      'Understanding Market Sentiment and FOMO',
    ],
  },
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
    } catch (err: any) {
      setChatMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

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

  if (selectedLesson) {
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
            <button onClick={() => setSelectedLesson(null)} className="text-sm text-gray-600 hover:text-gray-900 bg-transparent border-0 cursor-pointer flex items-center gap-2">
              ← Back to Academy
            </button>
          </div>
        </header>

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
              <p className="text-xs text-gray-400 mb-2">{selectedLesson.category}</p>
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

              <div className="bg-gray-50 rounded-xl p-5 mb-8">
                <p className="text-sm font-medium text-gray-700 mb-3">Key Takeaways</p>
                <ul className="space-y-2">
                  {lesson.keyTakeaways.map((t: string, i: number) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-green-600">✓</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {lesson.quizQuestion && (
                <div className="border border-gray-200 rounded-xl p-5">
                  <p className="text-sm font-medium text-gray-900 mb-4">Quick Check: {lesson.quizQuestion.question}</p>
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
                      {selectedQuizOption === lesson.quizQuestion.correctIndex ? '✓ Correct!' : '✗ Not quite — review the lesson above.'}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    );
  }

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
          <h1 className="text-2xl font-bold text-gray-900">Trading Academy</h1>
          <p className="text-gray-500 text-sm mt-1">Learn trading fundamentals, technical analysis, risk management, and market psychology</p>
        </div>

        <div className="space-y-8">
          {COURSES.map(course => (
            <div key={course.category}>
              <h2 className="font-semibold text-gray-900 mb-3">{course.category}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.lessons.map(lesson => (
                  <button
                    key={lesson}
                    onClick={() => handleSelectLesson(lesson, course.category)}
                    className="bg-white border border-gray-200 rounded-xl p-4 text-left hover:border-gray-400 transition-colors"
                  >
                    <p className="font-medium text-gray-900 text-sm">{lesson}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    {showAssistant && (
        <div className="fixed bottom-6 right-6 w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col" style={{ height: '500px' }}>
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <p className="font-semibold text-gray-900 text-sm">AI Learning Assistant</p>
            <button onClick={() => setShowAssistant(false)} className="text-gray-400 hover:text-gray-600 bg-transparent border-0 cursor-pointer">✕</button>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatMessages.length === 0 && (
              <p className="text-sm text-gray-400">Ask me anything about trading — "What is RSI?" or "Why did BTC drop today?"</p>
            )}
            {chatMessages.map((msg, i) => (
              <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                <span className={"inline-block px-3 py-2 rounded-xl text-sm max-w-[85%] " + (
                  msg.role === 'user' ? 'bg-black text-white' : 'bg-gray-100 text-gray-700'
                )}>
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
            <button
              onClick={handleAskAssistant}
              disabled={chatLoading}
              className="px-4 py-2 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
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