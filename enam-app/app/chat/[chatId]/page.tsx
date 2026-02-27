'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { Send, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import {
  initChat,
  sendMessage as sendFirebaseMessage,
  subscribeToMessages,
} from '@/lib/services/chat';
import { ChatMessage } from '@/types';
import ProtectedRoute from '@/components/ProtectedRoute';

export default function ChatPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { profile } = useAuth();

  const chatId = params.chatId as string;
  const listingId = searchParams.get('listingId') || '';
  const sellerId = searchParams.get('sellerId') || '';

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!profile || !chatId) return;

    if (DEMO_MODE) {
      setMessages(getDemoStore().getChatMessages(chatId));
      return;
    }

    initChat(chatId, listingId, profile.uid, sellerId);
    const unsub = subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs);
    });
    return () => unsub();
  }, [profile, chatId, listingId, sellerId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || !profile || sending) return;
    setSending(true);

    const msgText = text.trim();
    setText('');

    try {
      if (DEMO_MODE) {
        getDemoStore().sendChatMessage(chatId, profile.uid, msgText);
        setMessages(getDemoStore().getChatMessages(chatId));
      } else {
        await sendFirebaseMessage(chatId, profile.uid, msgText);
      }
    } catch {
      setText(msgText);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex flex-col h-screen bg-neutral-50">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-neutral-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <p className="text-sm font-semibold text-neutral-800">Trade Chat</p>
            <p className="text-[10px] text-neutral-400">Listing: {listingId.slice(0, 12)}...</p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-neutral-400">No messages yet</p>
              <p className="text-[10px] text-neutral-300 mt-1">
                Start chatting before confirming the trade
              </p>
            </div>
          )}

          {messages.map(msg => {
            const isOwn = msg.sender_uid === profile?.uid;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-sm ${
                    isOwn
                      ? 'bg-emerald-600 text-white rounded-br-md'
                      : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-md'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p
                    className={`text-[9px] mt-1 ${
                      isOwn ? 'text-emerald-200' : 'text-neutral-300'
                    }`}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="sticky bottom-0 bg-white border-t border-neutral-100 p-3">
          <div className="flex items-center gap-2 max-w-2xl mx-auto">
            <input
              type="text"
              value={text}
              onChange={e => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 border border-neutral-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim() || sending}
              className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
