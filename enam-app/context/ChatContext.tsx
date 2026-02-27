'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ChatMsg {
  id: string;
  role: 'user' | 'bot';
  text: string;
}

interface ChatState {
  messages: ChatMsg[];
  isOpen: boolean;
  isTyping: boolean;
  sendMessage: (text: string) => void;
  toggleChat: () => void;
  clearChat: () => void;
}

const RESPONSES: Record<string, string> = {
  greeting: 'Jai Kisan! 🌾 Welcome to AgriTrade. How can I help you today?',
  credit: 'AgriCredit (AC) is our digital token pegged to MSP prices. 1 AC ≈ ₹22.75 (wheat MSP per kg). You earn credits by trading, listing, and verifying other farmers!',
  msp: 'MSP (Minimum Support Price) is set by Govt. of India. Wheat MSP 2024-25: ₹2,275/quintal. Your AgriCredits are pegged to this, so values stay stable.',
  trade: 'To trade: 1) List your surplus crop with image. 2) Community verifies your listing. 3) Nearby buyers bid. 4) Agree on price in AgriCredits. 5) Escrow locks funds. 6) Complete handover → Credits released!',
  listing: 'To list produce: Go to Marketplace → Create Listing → Upload crop image → Enter quantity and grade → Submit. You earn 5 AC just for listing!',
  wallet: 'Your AgriCredit wallet shows balance, transaction history, and pending escrow amounts. Credits decay 2% monthly after 12 months of inactivity.',
  fee: 'Platform fee is just 1% of trade value. If you trade 1000 AC, you pay 10 AC fee. Farmers keep 990 AC. Fee goes to platform maintenance.',
  escrow: 'Escrow protects both parties! Buyer\'s credits are locked when they buy. Seller confirms delivery → Credits auto-release. Atomic Firestore transactions guarantee consistency.',
  geo: 'AgriTrade uses geographic constraints. You can only trade with farmers in your village. This ensures practical delivery and builds local trust networks.',
  verify: 'Community verification: 2 nearby verified farmers must endorse your listing. This prevents fake listings. You earn 15 AC for each farmer you verify!',
  register: 'Registration is free! Enter your mobile number, verify OTP, then fill your village details. You get 50 AC welcome bonus immediately!',
  default: 'I\'m your AgriTrade assistant. Ask me about: AgriCredits, MSP prices, how to trade, listing produce, wallet, fees, escrow, or registration.',
};

function getResponse(text: string): string {
  const l = text.toLowerCase();
  if (l.match(/hello|hi|namaste|jai kisan/)) return RESPONSES.greeting;
  if (l.match(/credit|ac |agri.?credit/)) return RESPONSES.credit;
  if (l.match(/msp|minimum support|support price|rate/)) return RESPONSES.msp;
  if (l.match(/trade|buy|sell/)) return RESPONSES.trade;
  if (l.match(/list|surplus|post|upload/)) return RESPONSES.listing;
  if (l.match(/wallet|balance|coins|tokens/)) return RESPONSES.wallet;
  if (l.match(/fee|charge|commission|cost/)) return RESPONSES.fee;
  if (l.match(/escrow|lock|secure/)) return RESPONSES.escrow;
  if (l.match(/geo|location|nearby|distance|radius/)) return RESPONSES.geo;
  if (l.match(/verify|verification|fake|trust/)) return RESPONSES.verify;
  if (l.match(/register|sign up|new|join/)) return RESPONSES.register;
  return RESPONSES.default;
}

const ChatContext = createContext<ChatState | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { id: 'init', role: 'bot', text: RESPONSES.greeting },
  ]);
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = useCallback((text: string) => {
    const userMsg: ChatMsg = { id: Date.now().toString(), role: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        text: getResponse(text),
      }]);
      setIsTyping(false);
    }, 600 + Math.random() * 600);
  }, []);

  const toggleChat = useCallback(() => setIsOpen(p => !p), []);
  const clearChat = useCallback(() => {
    setMessages([{ id: 'init', role: 'bot', text: RESPONSES.greeting }]);
  }, []);

  return (
    <ChatContext.Provider value={{ messages, isOpen, isTyping, sendMessage, toggleChat, clearChat }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within ChatProvider');
  return ctx;
}
