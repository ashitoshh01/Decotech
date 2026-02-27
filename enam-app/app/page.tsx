'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Menu,
  X,
  Leaf,
  ChevronDown,
  LogOut,
  User,
  Wallet,
  BarChart3,
  BarChart2,
  ShoppingBag,
  Coins,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  MapPin,
  Smartphone,
  CreditCard,
  Users,
  Building2,
  ArrowRight,
  CheckCircle2,
  Star,
  Globe2,
  Lock,
  Zap,
  Sprout,
  ChevronRight,
  Wheat,
  Clock,
  Shield
} from 'lucide-react';
import { MSP_RATES, AC_TO_INR } from '@/lib/agriCredit';

/* ── Ticker data ── */
const TICKER_ITEMS = [
  { crop: 'Wheat', state: 'Punjab', price: 2275, change: 2.1 },
  { crop: 'Rice', state: 'UP', price: 2300, change: 1.8 },
  { crop: 'Soybean', state: 'MP', price: 4892, change: -0.4 },
  { crop: 'Cotton', state: 'Gujarat', price: 7121, change: 3.2 },
  { crop: 'Mustard', state: 'Rajasthan', price: 5950, change: 1.5 },
  { crop: 'Maize', state: 'Karnataka', price: 2090, change: -0.7 },
  { crop: 'Sugarcane', state: 'Maharashtra', price: 340, change: 0.9 },
  { crop: 'Groundnut', state: 'AP', price: 6783, change: 2.4 },
];

/* ── Stats ── */
const PLATFORM_STATS = [
  { value: '1,522', label: 'Mandis Connected', icon: Building2 },
  { value: '23', label: 'States & UTs', icon: Globe2 },
  { value: '1.8 Cr', label: 'Registered Farmers', icon: Users },
  { value: '₹2.4L Cr', label: 'Volume Traded', icon: BarChart3 },
];

/* ── Steps ── */
const STEPS = [
  { num: 1, title: 'Register Free', desc: '60-second sign-up with mobile OTP. Get 50 AgriCredits as welcome bonus.', icon: Sprout },
  { num: 2, title: 'List Surplus Crop', desc: 'Upload photo, enter quantity & grade. MSP valuation auto-calculated in AgriCredits.', icon: Wheat },
  { num: 3, title: 'Get Verified', desc: 'Two nearby farmers endorse your listing. Fake listings can never mint credits.', icon: Users },
  { num: 4, title: 'Trade in Escrow', desc: "Buyer's credits locked at bid. Credits auto-release only after you confirm delivery.", icon: ShieldCheck },
];

/* ── Features ── */
const FEATURES = [
  { tag: 'Anti-Inflation', title: 'MSP-Pegged Credits', desc: '1 AC = ₹22.75 (wheat MSP/kg). Government MSP revisions keep your credits valuable.', icon: Coins },
  { tag: 'Zero-Risk Trades', title: 'Escrow Protection', desc: "Buyer's payment locked until delivery confirmed. No fraud, no delays — mathematically guaranteed.", icon: Lock },
  { tag: 'Local First', title: '20km Geo Radius', desc: 'Trade within 20km radius. Practical delivery windows + strong local trust networks.', icon: MapPin },
  { tag: 'Anti-Fake', title: 'Community Verification', desc: '2 verified farmers endorse each listing before credits are created. No fake produce.', icon: ShieldCheck },
  { tag: 'Price Intelligence', title: 'Supply-Demand Intel', desc: 'Live surplus/deficit analytics per village. Know the market before you sell.', icon: BarChart3 },
  { tag: 'Rural Friendly', title: 'Works on Feature Phones', desc: 'OTP keypad designed for KaiOS devices. No app download, minimal data usage.', icon: Zap },
];

/* ── Testimonials ── */
const TESTIMONIALS = [
  { name: 'Ramesh Patel', village: 'Anand, Gujarat', crop: 'Cotton', quote: 'I earned ₹12,000 more per quintal through AgriTrade compared to my local mandi. The escrow system gave me confidence.', gain: '+18%' },
  { name: 'Sunita Devi', village: 'Varanasi, UP', crop: 'Wheat', quote: 'As a woman farmer, I never had direct market access. Now I list my wheat and traders come to me. Very empowering.', gain: '+22%' },
  { name: 'Manoj Kumar', village: 'Kurnool, AP', crop: 'Groundnut', quote: 'The verification system means no more fraud. My neighbor verified my listing and we both earned AgriCredits.', gain: '+15%' },
  { name: 'Priya Singh', village: 'Indore, MP', crop: 'Soybean', quote: 'Settlement under 24 hours! I used to wait weeks at the mandi. Now I trade from home and get paid instantly.', gain: '+20%' },
];

/* ── MSP table commodities ── */
const TABLE_COMMODITIES = ['wheat', 'rice', 'maize', 'soybean', 'cotton', 'sugarcane', 'onion', 'tomato'];

export default function HomePage() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActiveTestimonial(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)' }}>
      {/* ═══ 1. TICKER ═══ */}
      <div style={{ background: 'var(--green-900)', overflow: 'hidden', display: 'flex', position: 'relative', height: '44px' }}>
        <div className="live-msp-badge anim-shiny-sweep" style={{ background: '#f59e0b', color: 'white', fontWeight: 800, padding: '0 24px', display: 'flex', alignItems: 'center', zIndex: 10, position: 'absolute', left: 0, top: '6px', bottom: '6px', fontSize: 13, letterSpacing: '0.05em' }}>
          LIVE MSP
        </div>
        <div className="ticker-track" style={{ paddingLeft: '130px', height: '100%', display: 'flex', alignItems: 'center' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 32px', whiteSpace: 'nowrap' }}>
              <span style={{ color: 'var(--green-300)', fontWeight: 600, fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><Leaf size={12} /> {t.crop} <span style={{ color: 'var(--green-500)', fontSize: 12 }}>{t.state}</span></span>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 13, fontFamily: 'Space Grotesk, sans-serif' }}>₹{t.price}/qtl</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2, color: t.change >= 0 ? '#4ade80' : '#fca5a5', fontSize: 12, fontWeight: 600 }}>
                {t.change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {t.change >= 0 ? '' : ''}{t.change}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ 2. HERO - 50/50 SPLIT ═══ */}
      <section style={{ minHeight: 'calc(100vh - 44px)', display: 'flex' }}>
        {/* Left Side - Content */}
        <div style={{ flex: 1, padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div className="anim-fadeUp" style={{ maxWidth: 640 }}>
            <div className="section-chip" style={{ background: 'var(--green-50)', color: 'var(--green-700)', padding: '6px 14px', marginBottom: 24, fontSize: 13, letterSpacing: '0.05em', fontWeight: 700, borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6, border: '1px solid var(--green-200)' }}>
              <CheckCircle2 size={16} color="var(--green-600)" /> GOVERNMENT OF INDIA - SFAC INITIATIVE
            </div>

            <h1 className="display" style={{ marginBottom: 24, color: '#111827', fontWeight: 800, lineHeight: 1.15, fontSize: 'clamp(3rem, 5vw, 4.5rem)' }}>
              India&rsquo;s Digital<br />
              <span style={{ color: 'var(--green-600)' }}>Agriculture</span><br />
              Exchange
            </h1>

            <p style={{ fontSize: 18, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 40 }}>
              Trade commodities, earn <strong>AgriCredits pegged to Government MSP</strong>, and connect directly with 1.8 crore farmers across 23 states. No middlemen, no delays.
            </p>

            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', marginBottom: 48 }}>
              <Link href="/register" className="btn btn-primary btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '0 36px', height: 60, fontSize: 16 }}>
                Start Trading Free <ArrowRight size={18} />
              </Link>
              <Link href="/listings" className="btn btn-outline btn-lg" style={{ borderRadius: 'var(--radius-full)', padding: '0 36px', height: 60, fontSize: 16, background: 'white' }}>
                Explore Market
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', padding: '24px 0', borderTop: '1px solid var(--border)' }}>
              {[
                { label: 'Avg Farmer Gain', value: '+18%' },
                { label: 'Platform Fee', value: '1%' },
                { label: 'Settlement', value: '<24h' },
              ].map((s, i) => (
                <div key={i} style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--green-700)', fontFamily: 'Space Grotesk, sans-serif' }}>{s.value}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-muted)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Image/Visuals */}
        <div className="hide-mobile anim-slideLeft" style={{ flex: 1, background: 'linear-gradient(135deg, var(--green-800), var(--green-950))', position: 'relative', overflow: 'hidden' }}>
          <img
            src="/hero-farmer-new-2.jpg"
            alt="Indian Farmer"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, var(--green-950) 0%, transparent 20%, transparent 80%, rgba(2,44,34,0.4) 100%)' }} />

          {/* Floating UI Elements */}
          <div className="anim-float" style={{ position: 'absolute', top: '25%', right: 40, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '20px 24px', borderRadius: '20px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10, width: 220 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><TrendingUp size={14} color="var(--green-600)" /> Live Escrow Trade</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--green-700)', fontFamily: 'Space Grotesk, sans-serif' }}>+₹3,240</span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Wheat &middot; Punjab</span>
          </div>

          <div className="anim-floatSlow" style={{ position: 'absolute', bottom: '25%', left: 40, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)', padding: '20px 24px', borderRadius: '20px', boxShadow: '0 24px 48px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column', gap: 6, zIndex: 10, width: 240 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}><Wallet size={14} color="var(--amber-500)" /> Secure Wallet</span>
            <span style={{ fontSize: 24, fontWeight: 800, color: 'var(--amber-500)', display: 'flex', alignItems: 'center', gap: 8, fontFamily: 'Space Grotesk, sans-serif' }}>
              <Coins size={20} />
              2,840 AC
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>≈ ₹64,610 value</span>
          </div>
        </div>
      </section>

      {/* ═══ 3. STATS BAND ═══ */}
      <section style={{ background: 'var(--green-900)', padding: '48px 0' }}>
        <div className="container">
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32 }}>
            {PLATFORM_STATS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
                  <s.icon size={28} color="var(--green-300)" />
                </div>
                <div className="stat-number" style={{ color: 'white' }}>{s.value}</div>
                <div style={{ fontSize: 13, color: 'var(--green-300)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 4. HOW IT WORKS ═══ */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div className="section-chip" style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              <Zap size={14} /> SIMPLE PROCESS
            </div>
            <h2 className="heading" style={{ color: '#064e3b', fontWeight: 800 }}>Trade in 4 Easy Steps</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '16px auto 0', fontSize: 16 }}>
              From farm to payment in under 24 hours. No paperwork, no middlemen.
            </p>
          </div>
          <div style={{ position: 'relative', paddingTop: 14 }}>
            <div className="hide-mobile" style={{ position: 'absolute', top: 36, left: '12.5%', right: '12.5%', height: 1, background: '#dcfce7' }} />
            <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
              {STEPS.map((s, i) => (
                <div key={i} className="anim-fadeUp" style={{ padding: '40px 24px', textAlign: 'center', animationDelay: `${i * 0.1}s`, background: 'white', borderRadius: 12, border: '1px solid #dcfce7', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', width: 28, height: 28, borderRadius: 'var(--radius-full)', background: '#16a34a', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', fontSize: 14 }}>
                    {s.num}
                  </div>
                  <div className="icon-box" style={{ margin: '0 auto 24px', background: '#f0fdf4', width: 64, height: 64, borderRadius: 16, color: '#16a34a' }}>
                    <s.icon size={28} />
                  </div>
                  <h3 style={{ fontSize: 17, marginBottom: 12, fontWeight: 700, color: '#1f2937' }}>{s.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ 5. FEATURES ═══ */}
      <section className="section" style={{ background: '#f6faf7' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-chip" style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0' }}>
              <Star size={14} /> WHY AGRITRADE
            </div>
            <h2 className="heading" style={{ color: '#064e3b', fontWeight: 800 }}>Policy-Grade Innovation</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: 560, margin: '16px auto 0', fontSize: 16 }}>
              Built for India&rsquo;s 14 crore farmers. Every feature has a reason.
            </p>
          </div>
          <div className="feat-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="anim-fadeUp" style={{ padding: 28, animationDelay: `${i * 0.08}s`, background: 'white', border: i === 4 ? '1px solid #86efac' : '1px solid #e5e7eb', borderRadius: 16, display: 'flex', gap: 20 }}>
                <div className="icon-box" style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: 12, width: 48, height: 48, flexShrink: 0 }}>
                  <f.icon size={22} />
                </div>
                <div>
                  <div style={{ display: 'inline-block', background: '#dcfce7', color: '#16a34a', fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 999, marginBottom: 12 }}>
                    {f.tag}
                  </div>
                  <h3 style={{ fontSize: 16, marginBottom: 8, fontWeight: 700, color: '#1f2937' }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ 6. AGRICREDIT EXPLAINER ═══ */}
      <section className="section" style={{ background: '#ffffff' }}>
        <div className="container">
          <div className="ac-expl-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div className="section-chip" style={{ background: '#dcfce7', color: '#16a34a', border: '1px solid #bbf7d0', padding: '6px 14px', marginBottom: 24 }}>
                <Link href="#" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Coins size={14} /> WHY AGRITRADE</Link>
              </div>
              <h2 className="heading" style={{ color: '#064e3b', fontWeight: 800, marginBottom: 12, lineHeight: 1.2 }}>
                The Credit System That<br />
                <span style={{ color: '#22c55e' }}>Protects Farmers</span>
              </h2>
              <p style={{ fontSize: 16, color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 40 }}>
                Built for India&rsquo;s 14 crore farmers. Every feature has a reason.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
                {[
                  {
                    icon: Coins,
                    title: 'MSP Pegging = Stable Value',
                    desc: '1 AC = ₹22.75 (wheat MSP per kg). Government revises MSP annually — your credits adjust too.'
                  },
                  {
                    icon: Lock,
                    title: 'Escrow = Zero Risk',
                    desc: 'Credits locked at bid. You deliver crop → credits auto-release. No payment delays, no disputes.'
                  },
                  {
                    icon: BarChart2,
                    title: '1% Fee = Sustainable Platform',
                    desc: 'Trade 2000 AC? Pay 20 AC. You keep 1980 AC. Traditional mandi charges 2–5% — we\'re always cheaper.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Earn While Participating',
                    desc: 'List (+5 AC), Complete trade (+10 AC), Verify farmer (+15 AC), Refer (+50 AC).'
                  },
                  {
                    icon: Clock,
                    title: 'Anti-Hoarding Mechanism',
                    desc: 'Credits inactive 12+ months decay at 2%/month. Keeps the economy liquid.'
                  }
                ].map((item, i) => (
                  <div key={i} className="anim-fadeUp" style={{ display: 'flex', gap: 20, alignItems: 'flex-start', animationDelay: `${i * 0.1}s` }}>
                    <div style={{ background: '#f0fdf4', color: '#16a34a', padding: 12, borderRadius: 12, flexShrink: 0 }}>
                      <item.icon size={20} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 700, color: '#1f2937', marginBottom: 4 }}>{item.title}</h4>
                      <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="anim-slideLeft" style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ background: 'linear-gradient(135deg, #166534, #14532d)', padding: 40, width: '100%', maxWidth: 420, borderRadius: 24, color: 'white', position: 'relative', overflow: 'hidden', boxShadow: '0 24px 48px rgba(22, 163, 74, 0.15)' }}>
                {/* Decorative background circles */}
                <div style={{ position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 140, height: 140, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

                <div style={{ position: 'relative', zIndex: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', opacity: 0.8, marginBottom: 8 }}>AGRITRADE</div>
                      <div style={{ fontSize: 36, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4, lineHeight: 1.1 }}>2,840 AC</div>
                      <div style={{ fontSize: 14, opacity: 0.9 }}>≈ ₹64,610</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 12, backdropFilter: 'blur(8px)' }}>
                      <Coins size={24} color="#86efac" />
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40, borderTop: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)', padding: '24px 0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>Last Trade</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>150 AC (Wheat)</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>In Escrow</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>320 AC</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: 14, opacity: 0.8 }}>Trust Score</span>
                      <span style={{ fontSize: 14, fontWeight: 600 }}>87 / 100</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.05em', opacity: 0.7, marginBottom: 4 }}>FARMER</div>
                    <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Gurpreet Singh &middot; Punjab</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#86efac' }}>
                      <ShieldCheck size={14} /> Community Verified &middot; Jan 2024
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>



      {/* ═══ 8. MSP TABLE ═══ */}
      <section className="section" style={{ background: '#ffffff', paddingTop: 64, paddingBottom: 64 }}>
        <div className="container" style={{ maxWidth: 880 }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="section-chip" style={{ background: '#dcfce7', color: '#16a34a', border: 'none', padding: '6px 14px', marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 999, fontSize: 12, fontWeight: 700, letterSpacing: '0.05em' }}>
              <TrendingUp size={14} /> PRICE REFERENCE
            </div>
            <h2 className="heading" style={{ color: '#064e3b', fontWeight: 800 }}>MSP &rarr; AgriCredit Conversion</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16, marginTop: 12 }}>Government MSP 2024-25. Auto-calculated in real time.</p>
          </div>

          <div style={{ background: 'white', borderRadius: 16, border: '1px solid #bbf7d0', overflow: 'hidden', boxShadow: '0 12px 32px rgba(22,163,74,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#14532d', color: '#a7f3d0' }}>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Commodity</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>MSP / Quintal</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>MSP / KG</th>
                  <th style={{ padding: '18px 24px', textAlign: 'left', fontSize: 11, fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Value in AC</th>
                </tr>
              </thead>
              <tbody>
                {TABLE_COMMODITIES.map((c, i) => {
                  const perQtl = MSP_RATES[c];
                  const perKg = perQtl / 100;
                  let acVal = (perKg / 22.75).toFixed(2);
                  if (acVal.endsWith('.00')) {
                    acVal = acVal.split('.')[0];
                  }

                  return (
                    <tr key={c} style={{ background: i % 2 === 0 ? 'white' : '#f0fdf4', borderBottom: i < TABLE_COMMODITIES.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                      <td style={{ padding: '18px 24px', fontWeight: 700, color: '#1f2937', textTransform: 'capitalize', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#22c55e', fontSize: 12 }}>●</span> {c}
                      </td>
                      <td style={{ padding: '18px 24px', color: '#4b5563', fontFamily: 'Space Grotesk, sans-serif' }}>₹{perQtl.toLocaleString('en-IN')}</td>
                      <td style={{ padding: '18px 24px', color: '#4b5563', fontFamily: 'Space Grotesk, sans-serif' }}>₹{perKg.toFixed(2)}</td>
                      <td style={{ padding: '18px 24px' }}>
                        <span style={{ display: 'inline-flex', background: '#dcfce7', color: '#16a34a', padding: '6px 14px', borderRadius: 999, fontWeight: 700, fontSize: 12 }}>{acVal} AC</span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 32 }}>
            <Link href="/prices" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', borderRadius: 12, border: '1px solid #22c55e', color: '#16a34a', fontWeight: 600, fontSize: 15, background: 'white', transition: 'all 0.2s' }}>
              View all 190+ commodities <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ 9. CTA ═══ */}
      <section style={{ background: '#14532d', padding: '80px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ background: '#166534', width: 56, height: 56, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 32 }}>
            <Leaf size={28} color="#86efac" />
          </div>
          <h2 className="heading" style={{ color: 'white', marginBottom: 24, fontSize: 36, fontWeight: 800 }}>Ready to Change How India<br />Farms?</h2>
          <p style={{ color: 'white', fontSize: 16, maxWidth: 600, margin: '0 auto 40px', lineHeight: 1.7 }}>
            Join 1.8 crore farmers already trading on AgriTrade. 50 AgriCredits credited<br />
            instantly on signup.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 32 }}>
            <Link href="/register" style={{ background: '#f59e0b', color: 'white', padding: '14px 28px', borderRadius: 8, fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', border: 'none' }}>
              Register as Farmer — Free <ArrowRight size={18} />
            </Link>
            <Link href="/login" style={{ background: 'white', color: '#14532d', padding: '14px 40px', borderRadius: 8, fontWeight: 700, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.2s', border: 'none' }}>
              Sign In
            </Link>
          </div>
          <p style={{ color: '#4ade80', fontSize: 12, fontWeight: 500 }}>
            Government of India &middot; Ministry of Agriculture & Farmers&apos; Welfare &middot; SFAC
          </p>
        </div>
      </section>

      {/* ═══ 10. FOOTER ═══ */}
      <footer style={{ background: '#022c22', padding: '64px 0 32px', color: '#86efac' }}>
        <div className="container">
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 40, marginBottom: 64 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Leaf size={18} color="white" />
                </div>
                <div style={{ fontSize: 20, fontWeight: 700, color: 'white', fontFamily: 'Space Grotesk, sans-serif' }}>AgriTrade</div>
              </div>
              <p style={{ fontSize: 13, lineHeight: 1.8, opacity: 0.9, maxWidth: 300, color: '#6ee7b7', marginBottom: 24 }}>
                Pan-India electronic trading portal for<br />
                agricultural commodities under Ministry of<br />
                Agriculture, Govt. of India.
              </p>
              <p style={{ fontSize: 13, color: '#6ee7b7' }}>
                Toll Free: 1800 270 0224
              </p>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 800, color: '#34d399', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <Link href="/" style={{ fontSize: 13, color: 'white', transition: 'opacity 0.2s' }}>Home</Link>
                <Link href="/listings" style={{ fontSize: 13, color: 'white', transition: 'opacity 0.2s' }}>Marketplace</Link>
                <Link href="/prices" style={{ fontSize: 13, color: 'white', transition: 'opacity 0.2s' }}>Live Prices</Link>
                <Link href="/dashboard" style={{ fontSize: 13, color: 'white', transition: 'opacity 0.2s' }}>Dashboard</Link>
                <Link href="/about" style={{ fontSize: 13, color: 'white', transition: 'opacity 0.2s' }}>About</Link>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 800, color: '#34d399', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Stakeholders</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>Farmers</span>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>Traders</span>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>APMC Officials</span>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>AgriTrade Mandis</span>
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 11, fontWeight: 800, color: '#34d399', marginBottom: 24, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Resources</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>AgriCredit Guide</span>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>MSP Rates 2024-25</span>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>Privacy Policy</span>
                <span style={{ fontSize: 13, color: 'white', cursor: 'pointer' }}>Contact Us</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <span style={{ fontSize: 12, color: '#34d399' }}>&copy; 2024 National Agriculture Market (AgriTrade). All rights reserved.</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <span style={{ fontSize: 12, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}><ShieldCheck size={14} /> WCAG 2.1 AA</span>
              <span style={{ fontSize: 12, color: '#34d399', display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={14} /> KaiOS Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
