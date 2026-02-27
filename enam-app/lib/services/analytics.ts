import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { CropAnalytics, Listing, Transaction } from '@/types';

export async function getCropAnalytics(): Promise<CropAnalytics[]> {
  if (!db) return [];

  const [listingsSnap, txnSnap] = await Promise.all([
    getDocs(collection(db, 'listings')),
    getDocs(collection(db, 'transactions')),
  ]);

  const cropMap = new Map<string, CropAnalytics>();

  for (const d of listingsSnap.docs) {
    const listing = d.data() as Listing;
    const existing = cropMap.get(listing.crop_type) || {
      crop_type: listing.crop_type,
      listings_count: 0,
      trade_count: 0,
      total_volume: 0,
    };
    existing.listings_count += 1;
    cropMap.set(listing.crop_type, existing);
  }

  for (const d of txnSnap.docs) {
    const txn = d.data() as Transaction;
    const existing = cropMap.get(txn.crop_type) || {
      crop_type: txn.crop_type,
      listings_count: 0,
      trade_count: 0,
      total_volume: 0,
    };
    existing.trade_count += 1;
    existing.total_volume += txn.amount;
    cropMap.set(txn.crop_type, existing);
  }

  return Array.from(cropMap.values());
}
