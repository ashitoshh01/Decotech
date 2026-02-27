export interface UserProfile {
  uid: string;
  phone: string;
  name: string;
  village: string;
  state: string;
  role: 'farmer' | 'trader' | 'admin';
  agriCredits: number;
  lockedCredits: number;
  verified: boolean;
  verificationCount: number;
  trustScore: number;
  totalTrades: number;
  lastTransactionDate: string | null;
  createdAt: string;
}

export interface Listing {
  id: string;
  seller_uid: string;
  seller_phone: string;
  crop_type: string;
  quantity: number;
  price_ac: number;
  image_url: string;
  village: string;
  verification_count: number;
  verified: boolean;
  verified_by: string[];
  status: 'open' | 'escrow' | 'closed';
  created_at: string;
}

export interface Transaction {
  id: string;
  listing_id: string;
  buyer_uid: string;
  seller_uid: string;
  buyer_phone: string;
  seller_phone: string;
  amount: number;
  fee: number;
  crop_type: string;
  quantity: number;
  status: 'escrow' | 'completed' | 'cancelled';
  created_at: string;
  completed_at: string | null;
}

export interface ChatMessage {
  id: string;
  chat_id: string;
  sender_uid: string;
  text: string;
  created_at: string;
}

export interface CropAnalytics {
  crop_type: string;
  listings_count: number;
  trade_count: number;
  total_volume: number;
}
