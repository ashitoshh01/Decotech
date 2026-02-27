import {
  collection,
  doc,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  setDoc,
  getDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import { ChatMessage } from '@/types';

export function generateChatId(listingId: string, buyerUid: string): string {
  return `${listingId}_${buyerUid}`;
}

export async function initChat(
  chatId: string,
  listingId: string,
  buyerUid: string,
  sellerUid: string
): Promise<void> {
  if (!db) return;

  const chatRef = doc(db, 'chats', chatId);
  const snap = await getDoc(chatRef);
  if (snap.exists()) return;

  await setDoc(chatRef, {
    id: chatId,
    listing_id: listingId,
    buyer_uid: buyerUid,
    seller_uid: sellerUid,
    last_message: '',
    updated_at: new Date().toISOString(),
  });
}

export async function sendMessage(
  chatId: string,
  senderUid: string,
  text: string
): Promise<void> {
  if (!db) return;

  const msgRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(msgRef, {
    chat_id: chatId,
    sender_uid: senderUid,
    text,
    created_at: new Date().toISOString(),
  });

  await setDoc(
    doc(db, 'chats', chatId),
    { last_message: text, updated_at: new Date().toISOString() },
    { merge: true }
  );
}

export function subscribeToMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void
): () => void {
  if (!db) return () => {};

  const q = query(
    collection(db, 'chats', chatId, 'messages'),
    orderBy('created_at', 'asc')
  );

  return onSnapshot(q, (snap) => {
    const messages = snap.docs.map(d => ({
      id: d.id,
      ...d.data(),
    } as ChatMessage));
    callback(messages);
  });
}
