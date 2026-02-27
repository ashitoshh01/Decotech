import { UserProfile, Listing, Transaction, ChatMessage, CropAnalytics } from '@/types';

const now = new Date().toISOString();
const week = new Date(Date.now() - 7 * 86400000).toISOString();
const twoWeeks = new Date(Date.now() - 14 * 86400000).toISOString();

const DEMO_USER: UserProfile = {
  uid: 'demo-user-1', phone: '+919876543210', name: 'Demo Farmer',
  village: 'Rampur', state: 'Uttar Pradesh', role: 'farmer',
  agriCredits: 2500, lockedCredits: 300,
  verified: true, verificationCount: 3, trustScore: 85, totalTrades: 12,
  lastTransactionDate: week, createdAt: twoWeeks,
};

const DEMO_LISTINGS: Listing[] = [
  { id: 'listing-1', seller_uid: 'demo-user-2', seller_phone: '+919876543211', crop_type: 'Wheat', quantity: 50, price_ac: 1100, image_url: '', village: 'Rampur', verification_count: 3, verified: true, verified_by: ['demo-user-3','demo-user-4','demo-user-5'], status: 'open', created_at: week },
  { id: 'listing-2', seller_uid: 'demo-user-3', seller_phone: '+919876543212', crop_type: 'Rice', quantity: 30, price_ac: 2200, image_url: '', village: 'Rampur', verification_count: 2, verified: true, verified_by: ['demo-user-1','demo-user-4'], status: 'open', created_at: week },
  { id: 'listing-3', seller_uid: 'demo-user-4', seller_phone: '+919876543213', crop_type: 'Mustard', quantity: 20, price_ac: 5450, image_url: '', village: 'Rampur', verification_count: 1, verified: false, verified_by: ['demo-user-2'], status: 'open', created_at: now },
  { id: 'listing-4', seller_uid: 'demo-user-5', seller_phone: '+919876543214', crop_type: 'Sugarcane', quantity: 100, price_ac: 315, image_url: '', village: 'Rampur', verification_count: 4, verified: true, verified_by: ['demo-user-1','demo-user-2','demo-user-3','demo-user-4'], status: 'open', created_at: twoWeeks },
];

const DEMO_TXNS: Transaction[] = [
  { id: 'txn-1', listing_id: 'l-old-1', buyer_uid: 'demo-user-1', seller_uid: 'demo-user-3', buyer_phone: '+919876543210', seller_phone: '+919876543212', amount: 300, fee: 3, crop_type: 'Rice', quantity: 10, status: 'escrow', created_at: week, completed_at: null },
  { id: 'txn-2', listing_id: 'l-old-2', buyer_uid: 'demo-user-2', seller_uid: 'demo-user-1', buyer_phone: '+919876543211', seller_phone: '+919876543210', amount: 550, fee: 5.5, crop_type: 'Wheat', quantity: 25, status: 'completed', created_at: twoWeeks, completed_at: week },
];

class DemoStore {
  user: UserProfile;
  listings: Listing[];
  transactions: Transaction[];
  chats: Map<string, ChatMessage[]>;

  constructor() {
    this.user = { ...DEMO_USER };
    this.listings = DEMO_LISTINGS.map(l => ({ ...l }));
    this.transactions = DEMO_TXNS.map(t => ({ ...t }));
    this.chats = new Map();
  }

  getUser(): UserProfile { return { ...this.user }; }

  updateUser(updates: Partial<UserProfile>): UserProfile {
    this.user = { ...this.user, ...updates };
    return { ...this.user };
  }

  getListings(village: string): Listing[] {
    return this.listings.filter(l => l.village === village && l.status === 'open').map(l => ({ ...l }));
  }

  getListing(id: string): Listing | undefined {
    const l = this.listings.find(x => x.id === id);
    return l ? { ...l } : undefined;
  }

  createListing(data: Omit<Listing, 'id' | 'created_at' | 'verification_count' | 'verified' | 'verified_by' | 'status'>): Listing {
    const listing: Listing = { ...data, id: `listing-${Date.now()}`, verification_count: 0, verified: false, verified_by: [], status: 'open', created_at: new Date().toISOString() };
    this.listings.unshift(listing);
    return { ...listing };
  }

  verifyListing(listingId: string, userId: string): Listing | undefined {
    const l = this.listings.find(x => x.id === listingId);
    if (!l || l.verified_by.includes(userId)) return l ? { ...l } : undefined;
    l.verified_by.push(userId);
    l.verification_count += 1;
    if (l.verification_count >= 2) l.verified = true;
    return { ...l };
  }

  buyListing(buyerUid: string, listingId: string): { transaction: Transaction; error?: string } | { error: string } {
    const l = this.listings.find(x => x.id === listingId);
    if (!l || l.status !== 'open') return { error: 'Listing not available' };
    const cost = l.price_ac * l.quantity;
    if (this.user.uid === buyerUid && this.user.agriCredits < cost) return { error: `Insufficient credits. Need ${cost} AC.` };
    if (this.user.uid === buyerUid) { this.user.agriCredits -= cost; this.user.lockedCredits += cost; }
    l.status = 'escrow';
    const txn: Transaction = { id: `txn-${Date.now()}`, listing_id: listingId, buyer_uid: buyerUid, seller_uid: l.seller_uid, buyer_phone: this.user.phone, seller_phone: l.seller_phone, amount: cost, fee: 0, crop_type: l.crop_type, quantity: l.quantity, status: 'escrow', created_at: new Date().toISOString(), completed_at: null };
    this.transactions.unshift(txn);
    return { transaction: txn };
  }

  confirmDelivery(txnId: string): { error?: string } {
    const txn = this.transactions.find(t => t.id === txnId);
    if (!txn || txn.status !== 'escrow') return { error: 'Transaction not in escrow' };
    const fee = txn.amount * 0.01;
    if (this.user.uid === txn.buyer_uid) this.user.lockedCredits -= txn.amount;
    if (this.user.uid === txn.seller_uid) this.user.agriCredits += (txn.amount - fee);
    txn.fee = fee; txn.status = 'completed'; txn.completed_at = new Date().toISOString();
    const l = this.listings.find(x => x.id === txn.listing_id);
    if (l) l.status = 'closed';
    this.user.lastTransactionDate = new Date().toISOString();
    return {};
  }

  getTransactions(userId: string): Transaction[] {
    return this.transactions.filter(t => t.buyer_uid === userId || t.seller_uid === userId).map(t => ({ ...t }));
  }

  getAnalytics(): CropAnalytics[] {
    const m = new Map<string, CropAnalytics>();
    for (const l of this.listings) {
      const e = m.get(l.crop_type) || { crop_type: l.crop_type, listings_count: 0, trade_count: 0, total_volume: 0 };
      e.listings_count += 1; m.set(l.crop_type, e);
    }
    for (const t of this.transactions) {
      const e = m.get(t.crop_type) || { crop_type: t.crop_type, listings_count: 0, trade_count: 0, total_volume: 0 };
      e.trade_count += 1; e.total_volume += t.amount; m.set(t.crop_type, e);
    }
    return Array.from(m.values());
  }

  getChatMessages(chatId: string): ChatMessage[] { return this.chats.get(chatId) || []; }

  sendChatMessage(chatId: string, senderUid: string, text: string): ChatMessage {
    const msg: ChatMessage = { id: `msg-${Date.now()}`, chat_id: chatId, sender_uid: senderUid, text, created_at: new Date().toISOString() };
    const msgs = this.chats.get(chatId) || [];
    msgs.push(msg);
    this.chats.set(chatId, msgs);
    return msg;
  }
}

let instance: DemoStore | null = null;
export function getDemoStore(): DemoStore {
  if (!instance) instance = new DemoStore();
  return instance;
}
