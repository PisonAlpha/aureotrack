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
    </main>
  );
}