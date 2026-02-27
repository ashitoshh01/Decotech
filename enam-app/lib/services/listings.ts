import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc,
  query, where, orderBy, arrayUnion, increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase/config';
import { Listing } from '@/types';

const COL = 'listings';

export async function createListing(data: {
  seller_uid: string;
  seller_phone: string;
  crop_type: string;
  quantity: number;
  price_ac: number;
  village: string;
  image: File;
}): Promise<Listing> {
  if (!db || !storage) throw new Error('Firebase not configured');

  const imageRef = ref(storage, `listings/${Date.now()}_${data.image.name}`);
  await uploadBytes(imageRef, data.image);
  const image_url = await getDownloadURL(imageRef);

  const listing: Omit<Listing, 'id'> = {
    seller_uid: data.seller_uid,
    seller_phone: data.seller_phone,
    crop_type: data.crop_type,
    quantity: data.quantity,
    price_ac: data.price_ac,
    image_url,
    village: data.village,
    verification_count: 0,
    verified: false,
    verified_by: [],
    status: 'open',
    created_at: new Date().toISOString(),
  };

  const docRef = await addDoc(collection(db, COL), listing);
  return { ...listing, id: docRef.id };
}

export async function getListingsByVillage(village: string): Promise<Listing[]> {
  if (!db) return [];

  const q = query(
    collection(db, COL),
    where('village', '==', village),
    where('status', '==', 'open'),
    orderBy('created_at', 'desc')
  );

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
}

export async function getListingById(id: string): Promise<Listing | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, COL, id));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Listing) : null;
}

export async function verifyListing(listingId: string, userId: string): Promise<void> {
  if (!db) return;

  const listingRef = doc(db, COL, listingId);
  const snap = await getDoc(listingRef);
  if (!snap.exists()) return;

  const data = snap.data() as Listing;
  if (data.verified_by.includes(userId)) return;

  const newCount = data.verification_count + 1;
  await updateDoc(listingRef, {
    verified_by: arrayUnion(userId),
    verification_count: increment(1),
    verified: newCount >= 2,
  });
}

export async function getAllListings(): Promise<Listing[]> {
  if (!db) return [];
  const snap = await getDocs(collection(db, COL));
  return snap.docs.map(d => ({ id: d.id, ...d.data() } as Listing));
}
