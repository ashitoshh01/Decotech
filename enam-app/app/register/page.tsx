'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Leaf, Coins, ShieldCheck, TrendingUp, Users, ArrowRight,
  CheckCircle2, ChevronLeft, Smartphone,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDemoStore } from '@/lib/demo-store';
import toast from 'react-hot-toast';
import type { ConfirmationResult } from 'firebase/auth';

const STATES = [
  'Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Gujarat',
  'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
  'West Bengal', 'Jammu & Kashmir',
];

const BENEFITS = [
  { icon: Coins, title: 'MSP-Pegged Credits', desc: 'Trade with stable, government-backed AgriCredits' },
  { icon: ShieldCheck, title: 'Escrow Protection', desc: 'Every transaction secured with smart escrow' },
  { icon: TrendingUp, title: '+18% Avg Gain', desc: 'Farmers earn more by eliminating middlemen' },
  { icon: Users, title: 'Community Trust', desc: 'Peer verification builds transparent markets' },
];

export default function RegisterPage() {
  const router = useRouter();
  const { sendOTP, verifyOTP, login, isDemo, signInWithGoogle } = useAuth();

  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [role, setRole] = useState<'farmer' | 'trader'>('farmer');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [village, setVillage] = useState('');
  const [state, setState] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const canProceed = name.trim() && phone.length === 10 && village.trim() && state;

  const handleSendOTP = async () => {
    if (!canProceed) {
      toast.error('Please fill all fields');
      return;
    }
    setLoading(true);
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 800));
        toast.success('Demo mode — enter any 6 digits');
      } else {
        const conf = await sendOTP(`+91${phone}`, 'recaptcha-register');
        setConfirmation(conf);
        toast.success('OTP sent to +91 ' + phone);
      }
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      if (isDemo) {
        const store = getDemoStore();
        store.updateUser({
          name,
          phone: `+91${phone}`,
          village: village || 'Rampur',
          state: state || 'Uttar Pradesh',
          role,
        });
        login(store.getUser());
        toast.success('Welcome to AgriTrade! 50 AC credited.');
      } else {
        const profile = await verifyOTP(confirmation, otp);
        login(profile);
        toast.success('Account created! 50 AC welcome bonus credited.');
      }
      router.push('/dashboard');
    } catch (err: any) {
      toast.error(err.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      if (isDemo) {
        toast('Google sign-in is disabled in Demo Mode', { icon: 'ℹ️' });
      } else {
        const profile = await signInWithGoogle();
        // Since we don't have all details from Google, we could prompt for them later, 
        // but for now we just log them in to match the login flow.
        login(profile);
        toast.success('Registration successful with Google!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', display: 'flex' }}>
      {/* ── Left panel (desktop) ── */}
      <div className="hide-mobile" style={{ width: 420, background: 'linear-gradient(165deg, var(--green-900), var(--green-700))', padding: '48px 40px', display: 'flex', flexDirection: 'column', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 40 }}>
          <div style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Leaf size={22} color="white" />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif' }}>AgriTrade</div>
            <div style={{ fontSize: 11, opacity: 0.6 }}>Agri Credit Exchange</div>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', lineHeight: 1.3, marginBottom: 12, color: 'white' }}>
          Join India&rsquo;s Largest Farmer-First Trading Platform
        </h2>
        <p style={{ fontSize: 14, opacity: 0.75, lineHeight: 1.7, marginBottom: 32 }}>
          Trade directly with MSP-pegged AgriCredits. No middlemen, no delays.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 40 }}>
          {BENEFITS.map((b, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <b.icon size={18} color="white" />
              </div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{b.title}</div>
                <div style={{ fontSize: 12, opacity: 0.65 }}>{b.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* 50 AC card */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-lg)', padding: 20, border: '1px solid rgba(255,255,255,0.15)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <Coins size={20} color="var(--amber-400)" />
            <span style={{ fontSize: 15, fontWeight: 700 }}>Welcome Gift</span>
          </div>
          <div style={{ fontSize: 13, opacity: 0.8 }}><strong>50 AC</strong> credited instantly on registration.</div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 24px' }}>
        <div style={{ width: '100%', maxWidth: 440 }}>
          {/* Mobile logo */}
          <div className="hide-desktop" style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--green-600), var(--green-700))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Leaf size={24} color="white" />
            </div>
            <h1 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif' }}>AgriTrade</h1>
          </div>

          {/* Step indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 28 }}>
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: step === 'details' ? 'var(--green-600)' : 'var(--green-100)', color: step === 'details' ? 'white' : 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>1</div>
            <span style={{ fontSize: 13, fontWeight: step === 'details' ? 600 : 400, color: step === 'details' ? 'var(--text-primary)' : 'var(--text-muted)' }}>Details</span>
            <div style={{ flex: 1, height: 2, background: step === 'otp' ? 'var(--green-500)' : 'var(--border)', borderRadius: 99 }} />
            <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-full)', background: step === 'otp' ? 'var(--green-600)' : 'var(--green-100)', color: step === 'otp' ? 'white' : 'var(--green-700)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>2</div>
            <span style={{ fontSize: 13, fontWeight: step === 'otp' ? 600 : 400, color: step === 'otp' ? 'var(--text-primary)' : 'var(--text-muted)' }}>OTP</span>
          </div>

          <div className="card" style={{ padding: 28 }}>
            {step === 'details' ? (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>Create Account</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Fill in your details to get started</p>

                {/* Role toggle */}
                <div style={{ marginBottom: 20 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8, display: 'block' }}>I am a</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {(['farmer', 'trader'] as const).map(r => (
                      <button
                        key={r}
                        onClick={() => setRole(r)}
                        style={{
                          flex: 1,
                          padding: '10px 16px',
                          borderRadius: 'var(--radius-md)',
                          border: `2px solid ${role === r ? 'var(--green-500)' : 'var(--border)'}`,
                          background: role === r ? 'var(--green-50)' : 'var(--bg-surface)',
                          color: role === r ? 'var(--green-700)' : 'var(--text-muted)',
                          fontWeight: 600,
                          fontSize: 14,
                          cursor: 'pointer',
                          textTransform: 'capitalize',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        {r === 'farmer' ? '🌾 ' : '📦 '}{r}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Full Name</label>
                  <input
                    className="input"
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Mobile Number</label>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div className="input" style={{ width: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: 14, padding: '0 8px', flexShrink: 0 }}>+91</div>
                    <input
                      className="input"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      placeholder="9876543210"
                      maxLength={10}
                    />
                  </div>
                </div>

                {/* Village */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Village / Town</label>
                  <input
                    className="input"
                    type="text"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    placeholder="e.g. Rampur"
                  />
                  {isDemo && (
                    <p style={{ fontSize: 11, color: 'var(--text-faint)', marginTop: 4 }}>Enter &quot;Rampur&quot; to see sample listings</p>
                  )}
                </div>

                {/* State */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>State</label>
                  <select
                    className="input"
                    value={state}
                    onChange={e => setState(e.target.value)}
                  >
                    <option value="">Select your state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* Welcome gift callout */}
                <div className="card-tinted" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderRadius: 'var(--radius-md)' }}>
                  <Coins size={18} color="var(--amber-500)" />
                  <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                    Get <strong style={{ color: 'var(--green-700)' }}>50 AgriCredits</strong> free on signup
                  </span>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleSendOTP}
                  disabled={loading || !canProceed}
                >
                  {loading ? 'Sending OTP...' : <>Continue <ArrowRight size={16} /></>}
                </button>

                <div style={{ margin: '16px 0', textAlign: 'center', position: 'relative' }}>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
                  <span style={{ background: 'var(--bg-canvas)', padding: '0 8px', fontSize: 13, color: 'var(--text-muted)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>or</span>
                </div>

                {/* Google sign-in */}
                <button
                  className="btn btn-outline"
                  style={{ width: '100%', marginBottom: 16, background: 'var(--bg-surface)' }}
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ marginRight: 8 }}>
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Sign up with Google
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-ghost"
                  style={{ marginBottom: 16, padding: '6px 0', fontSize: 13 }}
                  onClick={() => { setStep('details'); setOtp(''); }}
                >
                  <ChevronLeft size={16} /> Back to details
                </button>

                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>Verify OTP</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
                  Enter the 6-digit code sent to <strong>+91 {phone}</strong>
                </p>

                <input
                  className="input"
                  type="text"
                  inputMode="numeric"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit OTP"
                  maxLength={6}
                  autoFocus
                  style={{ textAlign: 'center', fontSize: 20, letterSpacing: 8, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, marginBottom: 20 }}
                />

                {isDemo && (
                  <p style={{ fontSize: 11, color: 'var(--text-faint)', textAlign: 'center', marginBottom: 16 }}>
                    Demo mode — enter any 6 digits
                  </p>
                )}

                <div className="card-tinted" style={{ padding: 14, display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, borderRadius: 'var(--radius-md)' }}>
                  <Smartphone size={16} color="var(--green-600)" />
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    Registering as <strong style={{ textTransform: 'capitalize' }}>{role}</strong> &middot; {name} &middot; {village}, {state}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%' }}
                  onClick={handleVerify}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : <>Verify & Create Account <CheckCircle2 size={16} /></>}
                </button>
              </>
            )}
          </div>

          {/* Login link */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 20 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--green-600)', fontWeight: 600 }}>Sign In</Link>
          </p>

          {isDemo && (
            <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>
              Demo Mode — registration works with any data
            </p>
          )}

          <div id="recaptcha-register" />
        </div>
      </div>
    </div>
  );
}
