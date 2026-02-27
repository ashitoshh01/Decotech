'use client';

import { MSP_RATES, AC_TO_INR, CREDIT_REWARDS, PLATFORM_FEE_PCT } from '@/lib/agriCredit';

const SAMPLE_CROPS = ['wheat', 'rice', 'cotton', 'soybean', 'sugarcane'];

export default function AboutPage() {
  const feePercent = PLATFORM_FEE_PCT * 100;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-canvas)' }}>
      {/* Hero */}
      <div className="gradient-brand py-16 px-4">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3">
            ACE × Decotech AgriTrade
          </h1>
          <p className="text-green-200 text-sm md:text-lg max-w-2xl mx-auto leading-relaxed">
            A unified agricultural commerce platform that combines MSP-pegged digital credits,
            escrow-secured trading, and community verification to create a fair, transparent
            marketplace for Indian farmers.
          </p>
        </div>
      </div>

      <div className="container py-10 space-y-10">
        {/* Vision & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:bg-white/90 transition-all">
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--green-800)' }}>🌱 Vision</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              To build a decentralized, trust-minimized agricultural marketplace where every farmer
              receives fair value for their produce — anchored to government-backed Minimum Support
              Prices, not volatile market speculation.
            </p>
          </div>
          <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:bg-white/90 transition-all">
            <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--green-800)' }}>🎯 Mission</h2>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Eliminate middlemen exploitation through peer-to-peer village-level trading,
              escrow-secured transactions, and a credit system that incentivizes honest participation
              while preventing inflation and hoarding.
            </p>
          </div>
        </div>

        {/* AgriCredit System */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            💰 The AgriCredit (AC) System
          </h2>

          <div className="rounded-xl p-5" style={{ background: 'var(--bg-muted)' }}>
            <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
              MSP Pegging Formula
            </h3>
            <div className="font-mono text-sm p-4 rounded-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
              <p>1 AC = ₹{AC_TO_INR} = 1 kg of wheat at MSP (2024-25)</p>
              <p className="mt-2">AC value for any crop = (MSP per kg) ÷ {AC_TO_INR}</p>
              <p className="mt-1">MSP per kg = MSP per quintal ÷ 100</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Sample Conversions
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ color: 'var(--text-muted)' }}>
                    <th className="text-left py-2 px-3 font-medium">Crop</th>
                    <th className="text-right py-2 px-3 font-medium">MSP/qtl</th>
                    <th className="text-right py-2 px-3 font-medium">MSP/kg</th>
                    <th className="text-right py-2 px-3 font-medium">AC/kg</th>
                    <th className="text-right py-2 px-3 font-medium">100 kg → AC</th>
                  </tr>
                </thead>
                <tbody>
                  {SAMPLE_CROPS.map(crop => {
                    const msp = MSP_RATES[crop];
                    const perKg = msp / 100;
                    const acPerKg = perKg / AC_TO_INR;
                    return (
                      <tr key={crop} className="border-t" style={{ borderColor: 'var(--border)' }}>
                        <td className="py-2.5 px-3 capitalize font-medium" style={{ color: 'var(--text-primary)' }}>
                          {crop}
                        </td>
                        <td className="py-2.5 px-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                          ₹{msp.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                          ₹{perKg.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          <span className="ac-badge text-xs">{acPerKg.toFixed(2)} AC</span>
                        </td>
                        <td className="py-2.5 px-3 text-right font-semibold" style={{ color: 'var(--green-700)' }}>
                          {(acPerKg * 100).toFixed(1)} AC
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Why MSP Pegging */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            📌 Why MSP Pegging?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
              <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--green-700)' }}>
                Price Stability
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                MSP is revised annually by CACP based on cost of production (A2+FL formula).
                Credits maintain purchasing power across seasons.
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
              <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--green-700)' }}>
                Government Backing
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                MSP is a legal commitment by the Government of India for 23+ crops.
                This gives AC a real-world anchor immune to speculation.
              </p>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
              <h4 className="text-sm font-semibold mb-1" style={{ color: 'var(--green-700)' }}>
                Anti-Inflation
              </h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Credits are minted only on trade completion — never on listing or signup.
                Supply of AC is directly tied to real agricultural output.
              </p>
            </div>
          </div>
        </div>

        {/* Escrow Mechanism */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-5">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🔒 Escrow Mechanism
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-muted)' }}>
              <div className="text-3xl mb-2">1️⃣</div>
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Lock</h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Buyer&apos;s credits are locked in escrow. Seller sees commitment. Neither party
                can withdraw until delivery is confirmed.
              </p>
            </div>
            <div className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-muted)' }}>
              <div className="text-3xl mb-2">2️⃣</div>
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Deliver</h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Seller delivers produce. Both parties can chat to coordinate logistics.
                Geo-constraint ensures same-village proximity.
              </p>
            </div>
            <div className="rounded-xl p-5 text-center" style={{ background: 'var(--bg-muted)' }}>
              <div className="text-3xl mb-2">3️⃣</div>
              <h4 className="text-sm font-bold mb-1" style={{ color: 'var(--text-primary)' }}>Release</h4>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Seller confirms delivery → credits released atomically. 99% to seller,
                {feePercent}% platform fee. Irreversible.
              </p>
            </div>
          </div>
        </div>

        {/* Revenue Model */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            💼 Revenue Model
          </h2>
          <div className="rounded-xl p-5" style={{ background: 'var(--bg-muted)' }}>
            <p className="text-sm mb-3" style={{ color: 'var(--text-secondary)' }}>
              The platform charges a flat <strong>{feePercent}%</strong> fee on every completed trade.
              No fees on listings, sign-ups, or failed transactions.
            </p>
            <div className="font-mono text-xs p-4 rounded-lg space-y-1" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
              <p>Example: Trade of 50 quintals wheat @ 1100 AC/q</p>
              <p>Total = 55,000 AC</p>
              <p>Fee = 55,000 × {PLATFORM_FEE_PCT} = 550 AC</p>
              <p>Seller receives = 54,450 AC</p>
              <p>Platform wallet += 550 AC (≈ ₹{(550 * AC_TO_INR).toLocaleString()})</p>
            </div>
          </div>
        </div>

        {/* Credit Rewards */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🏆 Credit Rewards
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ color: 'var(--text-muted)' }}>
                  <th className="text-left py-2 px-3 font-medium">Action</th>
                  <th className="text-right py-2 px-3 font-medium">Reward (AC)</th>
                  <th className="text-right py-2 px-3 font-medium">≈ INR Value</th>
                  <th className="text-left py-2 px-3 font-medium">Feasibility</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CREDIT_REWARDS).map(([action, amount]) => (
                  <tr key={action} className="border-t" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2.5 px-3 font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                      {action.replace(/_/g, ' ')}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="ac-badge text-xs">{amount} AC</span>
                    </td>
                    <td className="py-2.5 px-3 text-right" style={{ color: 'var(--text-secondary)' }}>
                      ₹{(amount * AC_TO_INR).toFixed(0)}
                    </td>
                    <td className="py-2.5 px-3 text-xs" style={{ color: 'var(--text-muted)' }}>
                      {amount <= 10
                        ? 'Micro-incentive, sustainable at scale'
                        : amount <= 25
                          ? 'Moderate — funded by platform fees'
                          : 'Premium — capped per user/month'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs p-3 rounded-lg" style={{ background: 'var(--bg-muted)', color: 'var(--text-muted)' }}>
            Rewards are minted from the platform&apos;s fee pool, not created from thin air.
            Total reward distribution is capped at 40% of collected fees to maintain sustainability.
          </p>
        </div>

        {/* Credit Expiry & Anti-Hoarding */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            ⏳ Credit Expiry &amp; Anti-Hoarding
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Decay Mechanism
              </h4>
              <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                After 12 months of inactivity (no trades), credits decay at 2% per month.
                This prevents hoarding and encourages active market participation.
              </p>
              <div className="font-mono text-xs p-3 rounded-lg" style={{ background: 'var(--bg-surface)', color: 'var(--text-muted)' }}>
                <p>Month 12: No decay</p>
                <p>Month 13: Balance × 0.98</p>
                <p>Month 14: Balance × 0.98²</p>
                <p>Month 24: Balance × 0.98¹²  ≈ 78.5%</p>
              </div>
            </div>
            <div className="rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
              <h4 className="text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                Why This Matters
              </h4>
              <ul className="text-xs space-y-2" style={{ color: 'var(--text-muted)' }}>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--green-600)' }}>✓</span>
                  Prevents wealth concentration by inactive accounts
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--green-600)' }}>✓</span>
                  Maintains credit velocity (credits must circulate to retain value)
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--green-600)' }}>✓</span>
                  12-month grace period is generous — most farmers trade seasonally
                </li>
                <li className="flex items-start gap-2">
                  <span style={{ color: 'var(--green-600)' }}>✓</span>
                  Any transaction resets the timer — even a small trade saves all credits
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Government Backing */}
        <div className="p-6 rounded-2xl bg-white/70 backdrop-blur-md border border-gray-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            🏛️ Government Backing &amp; MSP Coverage
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { stat: '23+', label: 'Crops with MSP' },
              { stat: '₹2.7L Cr', label: 'Annual procurement' },
              { stat: '7,000+', label: 'Mandis nationwide' },
              { stat: `${Object.keys(MSP_RATES).length}`, label: 'Crops on ACE' },
            ].map(({ stat, label }) => (
              <div key={label} className="text-center rounded-xl p-4" style={{ background: 'var(--bg-muted)' }}>
                <p className="stat-number" style={{ color: 'var(--green-700)' }}>{stat}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
              </div>
            ))}
          </div>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
            MSP is recommended by the Commission for Agricultural Costs and Prices (CACP)
            and approved by the Cabinet Committee on Economic Affairs (CCEA). The ACE platform
            uses these government-set prices as anchors — we do not set or modify prices.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <a href="/dashboard" className="btn btn-primary btn-lg">
            Go to Dashboard →
          </a>
        </div>
      </div>
    </div>
  );
}
