'use client';

import { useState, useMemo } from 'react';
import { Search, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MSP_RATES, AC_TO_INR, INR_TO_AC } from '@/lib/agriCredit';

const CROP_EMOJI: Record<string, string> = {
  wheat: '🌾', rice: '🍚', maize: '🌽', soybean: '🫘', cotton: '🏵️',
  sugarcane: '🎋', onion: '🧅', tomato: '🍅', potato: '🥔',
  mustard: '🟡', groundnut: '🥜', sunflower: '🌻', jowar: '🌿',
  bajra: '🪶', barley: '🌱', lentil: '🫛', chickpea: '🟤',
};

const MOCK_META: Record<string, { mandis: number; change: number; arrivals: number }> = {
  wheat: { mandis: 1842, change: 2.3, arrivals: 45200 },
  rice: { mandis: 1567, change: 1.1, arrivals: 38100 },
  maize: { mandis: 987, change: -0.8, arrivals: 12400 },
  soybean: { mandis: 654, change: 3.5, arrivals: 8900 },
  cotton: { mandis: 432, change: -1.2, arrivals: 15600 },
  sugarcane: { mandis: 1123, change: 0.0, arrivals: 67800 },
  onion: { mandis: 876, change: -4.5, arrivals: 23400 },
  tomato: { mandis: 765, change: 5.2, arrivals: 18700 },
  potato: { mandis: 934, change: -2.1, arrivals: 21300 },
  mustard: { mandis: 523, change: 1.8, arrivals: 6700 },
  groundnut: { mandis: 412, change: 0.5, arrivals: 5400 },
  sunflower: { mandis: 298, change: -0.3, arrivals: 3200 },
  jowar: { mandis: 567, change: 1.5, arrivals: 7800 },
  bajra: { mandis: 489, change: 0.9, arrivals: 9100 },
  barley: { mandis: 345, change: -1.5, arrivals: 4500 },
  lentil: { mandis: 678, change: 2.8, arrivals: 11200 },
  chickpea: { mandis: 589, change: 1.2, arrivals: 9800 },
};

type SortKey = 'name' | 'price' | 'change';

export default function PricesPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [sortAsc, setSortAsc] = useState(true);

  const commodities = useMemo(() => {
    let items = Object.entries(MSP_RATES).map(([key, mspPerQtl]) => {
      const mspPerKg = mspPerQtl / 100;
      const acPerKg = mspPerKg * INR_TO_AC;
      const meta = MOCK_META[key] || { mandis: 0, change: 0, arrivals: 0 };
      return { key, mspPerQtl, mspPerKg, acPerKg, acPer100Kg: acPerKg * 100, ...meta };
    });

    if (search) {
      items = items.filter(i => i.key.toLowerCase().includes(search.toLowerCase()));
    }

    items.sort((a, b) => {
      let cmp = 0;
      if (sortBy === 'name') cmp = a.key.localeCompare(b.key);
      else if (sortBy === 'price') cmp = a.mspPerQtl - b.mspPerQtl;
      else cmp = a.change - b.change;
      return sortAsc ? cmp : -cmp;
    });

    return items;
  }, [search, sortBy, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortBy === key) setSortAsc(!sortAsc);
    else { setSortBy(key); setSortAsc(true); }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      <div className="gradient-brand py-12 px-4">
        <div className="container text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Live MSP Prices</h1>
          <p className="text-green-200 text-sm md:text-base max-w-xl mx-auto">
            Real-time Minimum Support Prices for 17 commodities. All prices are
            government-mandated and serve as the pegging basis for AgriCredit (AC).
          </p>
        </div>
      </div>

      <div className="container py-8 space-y-6">
        {/* Search + Sort */}
        <div className="flex flex-col md:flex-row gap-4 pt-4 md:items-center">
          <div className="relative flex-1">
            <Search size={22} className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search commodity..."
              className="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/70 backdrop-blur-md text-gray-800 text-lg"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {(['name', 'price', 'change'] as SortKey[]).map(k => (
              <button
                key={k}
                onClick={() => toggleSort(k)}
                className={`btn btn-sm px-6 py-3 rounded-xl border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.04)] backdrop-blur-md transition-all ${sortBy === k ? 'bg-green-600 text-white font-medium border-transparent' : 'bg-white/70 text-gray-600 hover:bg-white/90'
                  }`}
              >
                {k.charAt(0).toUpperCase() + k.slice(1)}
                {sortBy === k && (sortAsc ? ' ↑' : ' ↓')}
              </button>
            ))}
          </div>
        </div>

        {/* Price Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-4">
          {commodities.map((c, i) => (
            <div
              key={c.key}
              className="p-6 rounded-[24px] anim-fadeUp bg-white/40 backdrop-blur-xl border border-white/50 shadow-[0_8px_32px_rgba(0,0,0,0.02)] hover:bg-white/60 transition-all duration-300"
              style={{ animationDelay: `${i * 30}ms` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{CROP_EMOJI[c.key] || '🌿'}</span>
                  <div>
                    <h3 className="font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
                      {c.key}
                    </h3>
                    <p className="text-xs" style={{ color: 'var(--text-faint)' }}>
                      {c.mandis.toLocaleString()} mandis
                    </p>
                  </div>
                </div>
                <span
                  className={`badge ${c.change > 0 ? 'badge-green' : c.change < 0 ? 'badge-red' : 'badge-gray'
                    }`}
                >
                  {c.change > 0 ? (
                    <TrendingUp size={12} />
                  ) : c.change < 0 ? (
                    <TrendingDown size={12} />
                  ) : (
                    <Minus size={12} />
                  )}
                  {c.change > 0 ? '+' : ''}{c.change.toFixed(1)}%
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>MSP / quintal</span>
                  <span className="font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    ₹{c.mspPerQtl.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>MSP / kg</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                    ₹{c.mspPerKg.toFixed(2)}
                  </span>
                </div>
                <div className="divider" />
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>AC / kg</span>
                  <span className="ac-badge text-xs">{c.acPerKg.toFixed(2)} AC</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>AC / 100 kg</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--green-700)' }}>
                    {c.acPer100Kg.toFixed(1)} AC
                  </span>
                </div>
                <div className="divider" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Arrivals (MT)</span>
                  <span className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                    {c.arrivals.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {commodities.length === 0 && (
          <div className="card-solid p-12 text-center">
            <p style={{ color: 'var(--text-muted)' }}>No commodities match your search.</p>
          </div>
        )}

        {/* Legend */}
        <div className="card-solid p-5">
          <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            Legend
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-2">
              <span className="ac-badge text-[10px]">AC</span>
              <span>AgriCredit — 1 AC = ₹{AC_TO_INR} (pegged to 1 kg wheat MSP)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-green text-[10px]">+%</span>
              <span>% change from previous MSP season</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>MSP</span>
              <span>Minimum Support Price — government-guaranteed floor price</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Arrivals</span>
              <span>Metric tonnes arriving at mandis (market yards) this week</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
