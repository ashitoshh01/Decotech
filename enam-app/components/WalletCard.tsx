'use client';

import { Wallet, Lock, Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWallet } from '@/context/WalletContext';

export default function WalletCard() {
  const { profile } = useAuth();
  const { available, locked, hasDecayRisk } = useWallet();

  if (!profile) return null;

  return (
    <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-5 md:p-6 text-white shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-emerald-200 text-xs font-medium uppercase tracking-wider">
            Available Balance
          </p>
          <p className="text-3xl md:text-4xl font-bold mt-1 tracking-tight">
            {(available || 0).toLocaleString()} <span className="text-lg font-normal opacity-80">AC</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          {profile.verified && (
            <div className="bg-white/20 p-2 rounded-full" title="Verified Farmer">
              <Shield size={16} />
            </div>
          )}
          <div className="bg-white/20 p-2 rounded-full">
            <Wallet size={16} />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg">
          <Lock size={13} className="text-yellow-300" />
          <span className="text-sm">
            <span className="text-yellow-300 font-semibold">{(locked || 0).toLocaleString()}</span>{' '}
            <span className="text-emerald-200 text-xs">Locked</span>
          </span>
        </div>
        <div className="text-emerald-200 text-xs">
          {profile.village || 'No village set'}
        </div>
      </div>

      {hasDecayRisk && (
        <div className="mt-3 flex items-center gap-2 bg-yellow-500/20 px-3 py-2 rounded-lg">
          <AlertTriangle size={14} className="text-yellow-300 shrink-0" />
          <p className="text-xs text-yellow-200">
            2% credit decay risk due to inactivity. Transact to avoid losses.
          </p>
        </div>
      )}
    </div>
  );
}
