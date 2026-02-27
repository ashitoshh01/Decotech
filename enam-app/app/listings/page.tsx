'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import AppShell from '@/components/AppShell';
import ListingCard from '@/components/ListingCard';
import EscrowModal from '@/components/EscrowModal';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import { getListingsByVillage, verifyListing as verifyListingFB } from '@/lib/services/listings';
import { buyListing as buyListingFB } from '@/lib/services/transactions';
import { generateChatId } from '@/lib/services/chat';
import { Listing } from '@/types';

export default function ListingsPage() {
  const { profile } = useAuth();
  const { available, refreshWallet } = useWallet();
  const router = useRouter();
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Listing | null>(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!profile) return;
    loadListings();
  }, [profile]);

  const loadListings = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      if (DEMO_MODE) {
        setListings(getDemoStore().getListings(profile.village));
      } else {
        const data = await getListingsByVillage(profile.village);
        setListings(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async () => {
    if (!profile || !selected) return;

    if (DEMO_MODE) {
      const result = getDemoStore().buyListing(profile.uid, selected.id);
      if ('error' in result && !('transaction' in result)) throw new Error(result.error);
      await refreshWallet();
      setSelected(null);
      loadListings();
      return;
    }

    await buyListingFB(profile.uid, selected.id);
    await refreshWallet();
    setSelected(null);
    loadListings();
  };

  const handleVerify = async (listing: Listing) => {
    if (!profile) return;
    if (DEMO_MODE) {
      getDemoStore().verifyListing(listing.id, profile.uid);
      loadListings();
      return;
    }
    await verifyListingFB(listing.id, profile.uid);
    loadListings();
  };

  const handleChat = (listing: Listing) => {
    if (!profile) return;
    const chatId = generateChatId(listing.id, profile.uid);
    router.push(`/chat/${chatId}?listingId=${listing.id}&sellerId=${listing.seller_uid}`);
  };

  const filtered = listings.filter(l =>
    !search || l.crop_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-bold text-neutral-800">Local Market</h1>
          <span className="text-xs text-neutral-400">{profile?.village || 'No village'}</span>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl shadow-sm border border-neutral-200 px-3 py-2.5">
          <Search size={16} className="text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by crop..."
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>

        {!profile?.village && (
          <div className="bg-amber-50 text-amber-700 text-xs p-3 rounded-xl">
            Set your village name in settings to see geo-filtered listings.
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-neutral-100">
            <p className="text-sm text-neutral-400">No listings in your area</p>
            <p className="text-xs text-neutral-300 mt-1">Check back later or create your own listing</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map(listing => (
              <ListingCard
                key={listing.id}
                listing={listing}
                currentUserId={profile?.uid || ''}
                onBuy={(l) => setSelected(l)}
                onChat={handleChat}
                onVerify={handleVerify}
              />
            ))}
          </div>
        )}

        {selected && (
          <EscrowModal
            listing={selected}
            availableCredits={available}
            onConfirm={handleBuy}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </AppShell>
  );
}
