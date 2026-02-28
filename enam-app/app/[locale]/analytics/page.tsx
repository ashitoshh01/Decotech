'use client';

import { useEffect, useState } from 'react';
import { ShoppingBag, TrendingUp, BarChart3, Wheat } from 'lucide-react';
import AppShell from '@/components/AppShell';
import StatCard from '@/components/StatCard';
import ChartCard from '@/components/ChartCard';
import { useAuth } from '@/context/AuthContext';
import { DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import { getCropAnalytics } from '@/lib/services/analytics';
import { CropAnalytics } from '@/types';

export default function AnalyticsPage() {
  const { profile } = useAuth();
  const [analytics, setAnalytics] = useState<CropAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      if (DEMO_MODE) {
        setAnalytics(getDemoStore().getAnalytics());
      } else {
        const data = await getCropAnalytics();
        setAnalytics(data);
      }
    } finally {
      setLoading(false);
    }
  };

  const totalListings = analytics.reduce((s, a) => s + a.listings_count, 0);
  const totalTrades = analytics.reduce((s, a) => s + a.trade_count, 0);
  const totalVolume = analytics.reduce((s, a) => s + a.total_volume, 0);

  const mostListed = analytics.length > 0
    ? analytics.reduce((a, b) => (a.listings_count > b.listings_count ? a : b)).crop_type
    : '-';

  const mostTraded = analytics.length > 0 && analytics.some(a => a.trade_count > 0)
    ? analytics.reduce((a, b) => (a.trade_count > b.trade_count ? a : b)).crop_type
    : '-';

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto space-y-5">
        <h1 className="text-lg font-bold text-neutral-800">Supply–Demand Intelligence</h1>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total Listings" value={totalListings} icon={ShoppingBag} color="emerald" />
              <StatCard label="Total Trades" value={totalTrades} icon={TrendingUp} color="blue" />
              <StatCard label="Most Listed" value={mostListed} icon={Wheat} color="amber" />
              <StatCard label="Trade Volume" value={`${totalVolume.toLocaleString()} AC`} icon={BarChart3} color="neutral" />
            </div>

            <div className="bg-white rounded-xl shadow-md p-4 border border-neutral-100">
              <h3 className="text-sm font-semibold text-neutral-700 mb-1">Most Traded Crop</h3>
              <p className="text-2xl font-bold text-emerald-700">{mostTraded}</p>
            </div>

            <ChartCard
              title="Listings by Crop"
              data={analytics}
              dataKey="listings_count"
              nameKey="crop_type"
              color="#059669"
            />

            <ChartCard
              title="Trade Volume (AC)"
              data={analytics.filter(a => a.total_volume > 0)}
              dataKey="total_volume"
              nameKey="crop_type"
              color="#f59e0b"
            />

            {/* Credit system explanation */}
            <div className="bg-white rounded-xl shadow-md p-4 border border-neutral-100 space-y-3">
              <h3 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                System Mechanics
              </h3>
              <div className="grid gap-2 text-xs text-neutral-500">
                <div className="bg-emerald-50 rounded-lg p-3">
                  <p className="font-medium text-emerald-700 mb-1">MSP Peg</p>
                  <p>
                    1 AgriCredit (AC) = ₹1 at MSP value. Credits are pegged to government minimum
                    support prices, ensuring stable value across rural markets.
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="font-medium text-yellow-700 mb-1">Anti-Hoarding</p>
                  <p>
                    Inactive accounts (12+ months) face 2% credit decay. This incentivizes
                    active participation and prevents credit stagnation.
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="font-medium text-blue-700 mb-1">Community Verification</p>
                  <p>
                    Listings require 2+ community verifications before earning a verified badge.
                    This prevents fake listings without centralized moderation.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppShell>
  );
}
