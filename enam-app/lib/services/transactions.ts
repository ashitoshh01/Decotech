import {
  collection, doc, getDoc, getDocs, query, where, orderBy, runTransaction,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { Transaction, UserProfile, Listing } from '@/types';

const TXN_COL = 'transactions';
const USERS_COL = 'users';
const LISTINGS_COL = 'listings';
const WALLET_COL = 'platform_wallet';

/**
 * Escrow buy: atomically lock buyer credits and create transaction.
 * No credits are minted — only existing credits can be transferred.
 */
export async function buyListing(buyerUid: string, listingId: string): Promise<Transaction> {
  if (!db) throw new Error('Firebase not configured');

  return runTransaction(db, async (txn) => {
    const buyerRef = doc(db!, USERS_COL, buyerUid);
    const listingRef = doc(db!, LISTINGS_COL, listingId);

    const buyerSnap = await txn.get(buyerRef);
    const listingSnap = await txn.get(listingRef);

    if (!buyerSnap.exists()) throw new Error('Buyer not found');
    if (!listingSnap.exists()) throw new Error('Listing not found');

    const buyer = buyerSnap.data() as UserProfile;
    const listing = { id: listingSnap.id, ...listingSnap.data() } as Listing;

    if (listing.status !== 'open') throw new Error('Listing is no longer available');
    if (listing.seller_uid === buyerUid) throw new Error('Cannot buy your own listing');

    const totalCost = listing.price_ac * listing.quantity;
    if (buyer.agriCredits < totalCost) {
      throw new Error(`Insufficient credits. Need ${totalCost} AC, have ${buyer.agriCredits} AC.`);
    }

    txn.update(buyerRef, {
      agriCredits: buyer.agriCredits - totalCost,
      lockedCredits: buyer.lockedCredits + totalCost,
    });

    txn.update(listingRef, { status: 'escrow' });

    const newTxnRef = doc(collection(db!, TXN_COL));
    const transaction: Omit<Transaction, 'id'> = {
      listing_id: listingId,
      buyer_uid: buyerUid,
      seller_uid: listing.seller_uid,
      buyer_phone: buyer.phone,
      seller_phone: listing.seller_phone,
      amount: totalCost,
      fee: 0,
      crop_type: listing.crop_type,
      quantity: listing.quantity,
      status: 'escrow',
      created_at: new Date().toISOString(),
      completed_at: null,
    };

    txn.set(newTxnRef, transaction);
    return { ...transaction, id: newTxnRef.id };
  });
}

/**
 * Release escrow: atomically transfer credits (minus 1% fee) to seller.
 */
export async function confirmDelivery(transactionId: string): Promise<void> {
  if (!db) throw new Error('Firebase not configured');

  await runTransaction(db, async (txn) => {
    const txnRef = doc(db!, TXN_COL, transactionId);
    const txnSnap = await txn.get(txnRef);

    if (!txnSnap.exists()) throw new Error('Transaction not found');
    const txnData = txnSnap.data() as Transaction;
    if (txnData.status !== 'escrow') throw new Error('Transaction not in escrow');

    const fee = txnData.amount * 0.01;
    const sellerAmount = txnData.amount - fee;

    const buyerRef = doc(db!, USERS_COL, txnData.buyer_uid);
    const sellerRef = doc(db!, USERS_COL, txnData.seller_uid);
    const listingRef = doc(db!, LISTINGS_COL, txnData.listing_id);
    const walletRef = doc(db!, WALLET_COL, 'main');

    const buyerSnap = await txn.get(buyerRef);
    const sellerSnap = await txn.get(sellerRef);
    const walletSnap = await txn.get(walletRef);

    if (!buyerSnap.exists() || !sellerSnap.exists()) throw new Error('User not found');

    const buyer = buyerSnap.data() as UserProfile;
    const seller = sellerSnap.data() as UserProfile;
    const now = new Date().toISOString();

    txn.update(buyerRef, {
      lockedCredits: buyer.lockedCredits - txnData.amount,
      lastTransactionDate: now,
    });
    txn.update(sellerRef, {
      agriCredits: seller.agriCredits + sellerAmount,
      lastTransactionDate: now,
    });
    txn.update(txnRef, { status: 'completed', fee, completed_at: now });
    txn.update(listingRef, { status: 'closed' });

    const currentFees = walletSnap.exists() ? (walletSnap.data().total_fees || 0) : 0;
    if (walletSnap.exists()) {
      txn.update(walletRef, { total_fees: currentFees + fee, last_updated: now });
    } else {
      txn.set(walletRef, { total_fees: fee, last_updated: now });
    }
  });
}

export async function getUserTransactions(userId: string): Promise<Transaction[]> {
  if (!db) return [];

  const buyerQ = query(collection(db, TXN_COL), where('buyer_uid', '==', userId), orderBy('created_at', 'desc'));
  const sellerQ = query(collection(db, TXN_COL), where('seller_uid', '==', userId), orderBy('created_at', 'desc'));

  const [buyerSnap, sellerSnap] = await Promise.all([getDocs(buyerQ), getDocs(sellerQ)]);

  const txns = new Map<string, Transaction>();
  for (const d of buyerSnap.docs) txns.set(d.id, { id: d.id, ...d.data() } as Transaction);
  for (const d of sellerSnap.docs) txns.set(d.id, { id: d.id, ...d.data() } as Transaction);

  return Array.from(txns.values()).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}
