'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, CheckCircle, Lock, MessageCircle, Truck } from 'lucide-react';
import AppShell from '@/components/AppShell';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';
import { DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import { getUserTransactions } from '@/lib/services/transactions';
import { confirmDelivery as confirmDeliveryFB } from '@/lib/services/transactions';
import { generateChatId } from '@/lib/services/chat';
import { Transaction } from '@/types';

export default function TransactionsPage() {
  const { profile } = useAuth();
  const { refreshWallet } = useWallet();
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;
    loadTransactions();
  }, [profile]);

  const loadTransactions = async () => {
    if (!profile) return;
    setLoading(true);
    try {
      if (DEMO_MODE) {
        setTransactions(getDemoStore().getTransactions(profile.uid));
      } else {
        const data = await getUserTransactions(profile.uid);
        setTransactions(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmDelivery = async (txnId: string) => {
    setConfirming(txnId);
    try {
      if (DEMO_MODE) {
        const result = getDemoStore().confirmDelivery(txnId);
        if (result.error) throw new Error(result.error);
      } else {
        await confirmDeliveryFB(txnId);
      }
      await refreshWallet();
      loadTransactions();
    } catch (err: any) {
      alert(err.message || 'Failed to confirm delivery');
    } finally {
      setConfirming(null);
    }
  };

  const handleChat = (txn: Transaction) => {
    if (!profile) return;
    const buyerUid = txn.buyer_uid;
    const chatId = generateChatId(txn.listing_id, buyerUid);
    const otherUid = profile.uid === txn.buyer_uid ? txn.seller_uid : txn.buyer_uid;
    router.push(`/chat/${chatId}?listingId=${txn.listing_id}&sellerId=${txn.seller_uid}`);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'escrow':
        return { icon: Lock, color: 'text-yellow-600', bg: 'bg-yellow-50', label: 'In Escrow' };
      case 'completed':
        return { icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', label: 'Completed' };
      default:
        return { icon: Clock, color: 'text-neutral-500', bg: 'bg-neutral-50', label: status };
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-4">
        <h1 className="text-lg font-bold text-neutral-800">Transactions</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-neutral-100">
            <p className="text-sm text-neutral-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map(txn => {
              const status = getStatusConfig(txn.status);
              const StatusIcon = status.icon;
              const isBuyer = profile?.uid === txn.buyer_uid;
              const isSeller = profile?.uid === txn.seller_uid;

              return (
                <div
                  key={txn.id}
                  className="bg-white rounded-xl shadow-md p-4 border border-neutral-100 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${status.bg}`}>
                        <StatusIcon size={16} className={status.color} />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-neutral-800">
                          {txn.crop_type} &middot; {txn.quantity}q
                        </p>
                        <p className="text-[10px] text-neutral-400">
                          {isBuyer ? 'You bought' : 'You sold'} &middot;{' '}
                          {new Date(txn.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-neutral-800">
                        {txn.amount.toLocaleString()} AC
                      </p>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${status.bg} ${status.color}`}
                      >
                        {status.label}
                      </span>
                    </div>
                  </div>

                  {txn.status === 'escrow' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleChat(txn)}
                        className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors flex-1 justify-center"
                      >
                        <MessageCircle size={14} />
                        Chat
                      </button>
                      {isSeller && (
                        <button
                          onClick={() => handleConfirmDelivery(txn.id)}
                          disabled={confirming === txn.id}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex-1 justify-center disabled:opacity-50"
                        >
                          {confirming === txn.id ? (
                            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          ) : (
                            <>
                              <Truck size={14} />
                              Mark Delivered
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  )}

                  {txn.status === 'completed' && txn.fee > 0 && (
                    <div className="text-[10px] text-neutral-400 flex items-center gap-2">
                      <span>Fee: {txn.fee.toLocaleString()} AC (1%)</span>
                      <span>&middot;</span>
                      <span>
                        Completed {txn.completed_at && new Date(txn.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Escrow explanation */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-neutral-100">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
            Escrow Flow
          </h3>
          <div className="flex items-center gap-2 text-[10px] text-neutral-400 flex-wrap">
            <span className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-full">Lock Credits</span>
            <span>→</span>
            <span className="bg-neutral-100 px-2 py-1 rounded-full">Delivery</span>
            <span>→</span>
            <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full">Release (99%)</span>
            <span>+</span>
            <span className="bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full">Fee (1%)</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
