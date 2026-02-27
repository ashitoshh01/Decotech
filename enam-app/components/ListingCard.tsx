'use client';

import { Wheat, MessageCircle, ShoppingCart, UserCheck } from 'lucide-react';
import { Listing } from '@/types';
import VerifiedBadge from './VerifiedBadge';

interface Props {
  listing: Listing;
  currentUserId: string;
  onBuy?: (listing: Listing) => void;
  onChat?: (listing: Listing) => void;
  onVerify?: (listing: Listing) => void;
}

const CROP_COLORS: Record<string, string> = {
  Wheat: 'bg-amber-100 text-amber-700',
  Rice: 'bg-green-100 text-green-700',
  Mustard: 'bg-yellow-100 text-yellow-700',
  Sugarcane: 'bg-emerald-100 text-emerald-700',
  Cotton: 'bg-blue-100 text-blue-700',
};

export default function ListingCard({ listing, currentUserId, onBuy, onChat, onVerify }: Props) {
  const isOwn = listing.seller_uid === currentUserId;
  const canVerify = !isOwn && !listing.verified_by.includes(currentUserId);
  const totalCost = listing.price_ac * listing.quantity;
  const cropColor = CROP_COLORS[listing.crop_type] || 'bg-neutral-100 text-neutral-700';

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col gap-3 border border-neutral-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${cropColor}`}>
            {listing.crop_type}
          </span>
          <VerifiedBadge verified={listing.verified} count={listing.verification_count} />
        </div>
        {isOwn && (
          <span className="text-[10px] text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full">
            Your listing
          </span>
        )}
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold text-neutral-800">{totalCost.toLocaleString()}</span>
        <span className="text-sm text-neutral-400">AC</span>
      </div>

      <div className="flex items-center gap-4 text-xs text-neutral-500">
        <span>{listing.quantity} quintals</span>
        <span>@{listing.price_ac} AC/q</span>
        <span className="text-neutral-300">|</span>
        <span>{listing.village}</span>
      </div>

      {!isOwn && listing.status === 'open' && (
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => onChat?.(listing)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex-1 justify-center"
          >
            <MessageCircle size={14} />
            Chat
          </button>
          <button
            onClick={() => onBuy?.(listing)}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex-1 justify-center"
          >
            <ShoppingCart size={14} />
            Buy
          </button>
          {canVerify && (
            <button
              onClick={() => onVerify?.(listing)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-xl transition-colors"
              title="Verify this farmer's listing"
            >
              <UserCheck size={14} />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
