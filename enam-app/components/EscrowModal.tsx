'use client';

import { useState } from 'react';
import { Lock, ArrowRight, X, AlertCircle } from 'lucide-react';
import { Listing } from '@/types';

interface Props {
  listing: Listing;
  availableCredits: number;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

export default function EscrowModal({ listing, availableCredits, onConfirm, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const totalCost = listing.price_ac * listing.quantity;
  const fee = totalCost * 0.01;
  const hasEnough = availableCredits >= totalCost;

  const handleConfirm = async () => {
    setLoading(true);
    setError('');
    try {
      await onConfirm();
    } catch (err: any) {
      setError(err.message || 'Transaction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-4 border-b border-neutral-100">
          <h3 className="font-semibold text-neutral-800 flex items-center gap-2">
            <Lock size={16} className="text-yellow-500" />
            Escrow Confirmation
          </h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600">
            <X size={18} />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Trade Summary */}
          <div className="bg-neutral-50 rounded-xl p-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Crop</span>
              <span className="font-medium">{listing.crop_type}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Quantity</span>
              <span className="font-medium">{listing.quantity} quintals</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Rate</span>
              <span className="font-medium">{listing.price_ac} AC/q</span>
            </div>
            <hr className="border-neutral-200" />
            <div className="flex justify-between text-sm font-semibold">
              <span>Total</span>
              <span className="text-emerald-700">{totalCost.toLocaleString()} AC</span>
            </div>
            <div className="flex justify-between text-xs text-neutral-400">
              <span>Platform fee (1%)</span>
              <span>{fee.toLocaleString()} AC</span>
            </div>
          </div>

          {/* Escrow explanation */}
          <div className="text-xs text-neutral-500 bg-yellow-50 rounded-xl p-3">
            <p className="font-medium text-yellow-700 mb-1">How escrow works:</p>
            <p>
              Your credits will be <strong>locked</strong> until the seller confirms delivery.
              On delivery, 99% goes to the seller and 1% platform fee is deducted.
              No partial writes — fully atomic.
            </p>
          </div>

          {/* Balance check */}
          {!hasEnough && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
              <AlertCircle size={14} />
              Insufficient credits. You have {availableCredits} AC, need {totalCost} AC.
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 px-3 py-2 rounded-xl">
              <AlertCircle size={14} />
              {error}
            </div>
          )}
        </div>

        <div className="p-4 border-t border-neutral-100 flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 text-sm font-medium text-neutral-600 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={!hasEnough || loading}
            className="flex-1 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Lock Credits
                <ArrowRight size={14} />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
