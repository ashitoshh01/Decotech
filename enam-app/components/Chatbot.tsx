'use client';

import { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { MessageCircle, X, Send, Bot, RotateCcw } from 'lucide-react';

const QUICK_REPLIES = [
  'AgriCredit kya hai?',
  'MSP rate batao',
  'Trade kaise kare?',
  'Fee kitni hai?',
] as const;

export default function Chatbot() {
  const { messages, isOpen, isTyping, sendMessage, toggleChat, clearChat } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    sendMessage(text);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: 24,
          right: 16,
          zIndex: 200,
          width: 56,
          height: 56,
          borderRadius: '50%',
          border: 'none',
          background: 'linear-gradient(135deg, #16a34a, #15803d)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 6px 24px rgba(22,163,74,0.35)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.08)';
          e.currentTarget.style.boxShadow = '0 8px 30px rgba(22,163,74,0.45)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 6px 24px rgba(22,163,74,0.35)';
        }}
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 96,
            right: 16,
            zIndex: 200,
            width: 'min(384px, calc(100vw - 32px))',
            maxHeight: 520,
            borderRadius: 18,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 16px 50px rgba(0,0,0,0.16), 0 0 0 1px rgba(0,0,0,0.04)',
            background: 'var(--bg-card, #ffffff)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #16a34a, #15803d)',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Bot size={18} color="#fff" />
              </span>
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#fff' }}>AgriBot</p>
                <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>Always online</p>
              </div>
            </div>
            <button
              onClick={clearChat}
              title="Clear chat"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 32,
                height: 32,
                borderRadius: '50%',
                border: 'none',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.25)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255,255,255,0.15)')}
            >
              <RotateCcw size={15} />
            </button>
          </div>

          {/* Messages */}
          <div
            ref={scrollRef}
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '14px 12px',
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              minHeight: 280,
              maxHeight: 340,
              background: 'var(--bg-muted, #f9fafb)',
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '82%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    fontSize: 13,
                    lineHeight: 1.5,
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #16a34a, #15803d)'
                        : 'var(--bg-card, #ffffff)',
                    color: msg.role === 'user' ? '#fff' : 'var(--text-primary, #111827)',
                    boxShadow:
                      msg.role === 'bot' ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
                  }}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {isTyping && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div
                  style={{
                    padding: '10px 18px',
                    borderRadius: '14px 14px 14px 4px',
                    background: 'var(--bg-card, #ffffff)',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <TypingDot delay={0} />
                  <TypingDot delay={150} />
                  <TypingDot delay={300} />
                </div>
              </div>
            )}

            {/* Quick replies (show when few messages) */}
            {messages.length <= 2 && !isTyping && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
                {QUICK_REPLIES.map((text) => (
                  <button
                    key={text}
                    onClick={() => sendMessage(text)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: 999,
                      border: '1px solid rgba(22,163,74,0.25)',
                      background: 'rgba(22,163,74,0.06)',
                      color: '#15803d',
                      fontSize: 12,
                      fontWeight: 500,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                      whiteSpace: 'nowrap',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(22,163,74,0.12)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(22,163,74,0.06)')}
                  >
                    {text}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div
            style={{
              padding: '10px 12px',
              borderTop: '1px solid var(--border, rgba(0,0,0,0.06))',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: 'var(--bg-card, #ffffff)',
            }}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              style={{
                flex: 1,
                padding: '10px 14px',
                borderRadius: 10,
                border: '1px solid var(--border, rgba(0,0,0,0.1))',
                background: 'var(--bg-muted, #f9fafb)',
                fontSize: 13,
                outline: 'none',
                color: 'var(--text-primary, #111827)',
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                border: 'none',
                background: input.trim()
                  ? 'linear-gradient(135deg, #16a34a, #15803d)'
                  : 'var(--bg-muted, #e5e7eb)',
                color: input.trim() ? '#fff' : 'var(--text-muted, #9ca3af)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: input.trim() ? 'pointer' : 'not-allowed',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function TypingDot({ delay }: { delay: number }) {
  return (
    <span
      style={{
        width: 7,
        height: 7,
        borderRadius: '50%',
        background: '#16a34a',
        display: 'inline-block',
        animation: 'agribot-bounce 1.2s infinite ease-in-out',
        animationDelay: `${delay}ms`,
      }}
    >
      <style>{`
        @keyframes agribot-bounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </span>
  );
}
