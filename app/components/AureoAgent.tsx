'use client';

import { useState, useEffect, useRef } from 'react';

export default function AureoAgent() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: 'Hi! I\'m AureoAI, your trading intelligence assistant. Ask me anything about markets, trading, or how to use AureoTrack.',
      }]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input.trim() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input.trim(), history: messages }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages([...newMessages, { role: 'assistant', content: data.answer }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const QUICK_PROMPTS = [
    'How do I start trading?',
    'What is the BTC/Gold correlation?',
    'How do I earn a certificate?',
    'What is leverage?',
  ];

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:right-6 sm:w-full sm:max-w-sm z-50 shadow-2xl rounded-2xl overflow-hidden border border-white/20" style={{ height: minimized ? 'auto' : '520px', display: 'flex', flexDirection: 'column' }}>
          <div className="bg-black px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <img src="/aureotrack-logo.png" alt="AureoAI" className="w-7 h-7 rounded-lg object-cover" />
              <div>
                <p className="text-white text-sm font-semibold">AureoAI</p>
                <p className="text-green-400 text-xs">Online</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setMinimized(!minimized)} className="text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer text-lg leading-none">
                {minimized ? '▲' : '▼'}
              </button>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-white bg-transparent border-0 cursor-pointer text-lg leading-none">✕</button>
            </div>
          </div>

          {!minimized && (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#111111]">
                {messages.map((msg, i) => (
                  <div key={i} className={msg.role === 'user' ? 'text-right' : 'text-left'}>
                    <span className={"inline-block px-3 py-2 rounded-xl text-sm max-w-[85%] text-left " + (msg.role === 'user' ? 'bg-yellow-500 text-black font-medium' : 'bg-white/10 text-gray-200')}>
                      {msg.content}
                    </span>
                  </div>
                ))}
                {loading && (
                  <div className="text-left">
                    <span className="inline-block px-3 py-2 rounded-xl text-sm bg-white/10 text-gray-400">
                      <span className="animate-pulse">AureoAI is thinking...</span>
                    </span>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {messages.length <= 1 && (
                <div className="px-4 py-2 bg-[#111111] flex flex-wrap gap-2 flex-shrink-0">
                  {QUICK_PROMPTS.map(prompt => (
                    <button
                      key={prompt}
                      onClick={() => { setInput(prompt); }}
                      className="px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}

              <div className="p-3 bg-[#0d0d0d] border-t border-white/10 flex gap-2 flex-shrink-0">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask AureoAI anything..."
                  className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-600 focus:outline-none focus:border-yellow-500/50"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="px-4 py-2 bg-yellow-500 text-black rounded-xl text-sm font-semibold hover:bg-yellow-400 transition-colors disabled:opacity-40 cursor-pointer"
                >
                  Send
                </button>
              </div>
            </>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
        style={{ background: open ? '#1a1a1a' : 'linear-gradient(135deg, #f59e0b, #d97706)', border: '2px solid rgba(255,255,255,0.2)' }}
      >
        {open ? (
          <span className="text-white text-xl">✕</span>
        ) : (
          <img src="/aureotrack-logo.png" alt="AureoAI" className="w-8 h-8 rounded-full object-cover" />
        )}
      </button>
    </>
  );
}