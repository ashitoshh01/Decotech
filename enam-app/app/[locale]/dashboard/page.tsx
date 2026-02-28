'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { PlusCircle, ShoppingBag, ArrowLeftRight, TrendingUp } from 'lucide-react';
import AppShell from '@/components/AppShell';
import WalletCard from '@/components/WalletCard';
import StatCard from '@/components/StatCard';
import { useAuth } from '@/context/AuthContext';
import { DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import { getUserTransactions } from '@/lib/services/transactions';
import { Transaction } from '@/types';

export default function DashboardPage() {
  const { profile } = useAuth();
  const [recentTxns, setRecentTxns] = useState<Transaction[]>([]);

  useEffect(() => {
    if (!profile) return;
    if (DEMO_MODE) {
      setRecentTxns(getDemoStore().getTransactions(profile.uid).slice(0, 3));
    } else {
      getUserTransactions(profile.uid).then(txns => setRecentTxns(txns.slice(0, 3)));
    }
  }, [profile]);

  const escrowCount = recentTxns.filter(t => t.status === 'escrow').length;
  const completedCount = recentTxns.filter(t => t.status === 'completed').length;
  const totalVolume = recentTxns.reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <WalletCard />

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/create"
            className="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 border border-neutral-100 hover:shadow-lg transition-shadow"
          >
            <div className="bg-emerald-50 p-2.5 rounded-xl">
              <PlusCircle size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">Sell Crop</p>
              <p className="text-[10px] text-neutral-400">List your surplus</p>
            </div>
          </Link>
          <Link
            href="/listings"
            className="flex items-center gap-3 bg-white rounded-xl shadow-md p-4 border border-neutral-100 hover:shadow-lg transition-shadow"
          >
            <div className="bg-amber-50 p-2.5 rounded-xl">
              <ShoppingBag size={18} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-neutral-800">Browse</p>
              <p className="text-[10px] text-neutral-400">Local market</p>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard label="In Escrow" value={escrowCount} icon={ArrowLeftRight} color="amber" />
          <StatCard label="Completed" value={completedCount} icon={TrendingUp} color="blue" />
          <StatCard label="Volume" value={`${totalVolume} AC`} icon={TrendingUp} color="emerald" />
        </div>

        {/* Recent Transactions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-neutral-700">Recent Activity</h2>
            <Link href="/transactions" className="text-xs text-emerald-600 hover:underline">
              View all
            </Link>
          </div>

          {recentTxns.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-8 text-center border border-neutral-100">
              <p className="text-sm text-neutral-400">No transactions yet</p>
              <p className="text-xs text-neutral-300 mt-1">
                Start by creating a listing or buying from the market
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTxns.map(txn => (
                <div
                  key={txn.id}
                  className="bg-white rounded-xl shadow-sm p-3 flex items-center justify-between border border-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        txn.status === 'escrow'
                          ? 'bg-yellow-500'
                          : txn.status === 'completed'
                          ? 'bg-blue-500'
                          : 'bg-neutral-300'
                      }`}
                    />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {txn.crop_type} &middot; {txn.quantity}q
                      </p>
                      <p className="text-[10px] text-neutral-400">
                        {profile?.uid === txn.buyer_uid ? 'Bought' : 'Sold'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-neutral-800">
                      {txn.amount.toLocaleString()} AC
                    </p>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        txn.status === 'escrow'
                          ? 'bg-yellow-50 text-yellow-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {txn.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Info */}
        <div className="bg-white rounded-xl shadow-md p-4 border border-neutral-100">
          <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3">
            How ACE Works
          </h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-neutral-500">
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="font-medium text-neutral-700 mb-1">MSP Pegged</p>
              <p>1 AC = ₹1 MSP value. No inflation — credits created only on trade completion.</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="font-medium text-neutral-700 mb-1">Escrow Secured</p>
              <p>Credits locked until delivery confirmed. Atomic transactions prevent fraud.</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="font-medium text-neutral-700 mb-1">1% Fee Model</p>
              <p>Sustainable platform fee on completed trades only. No hidden charges.</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="font-medium text-neutral-700 mb-1">Geo Constrained</p>
              <p>Same-village trading ensures realistic, verifiable local exchange.</p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
