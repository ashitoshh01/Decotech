'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Leaf, Delete, Coins } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getDemoStore } from '@/lib/demo-store';
import toast from 'react-hot-toast';
import type { ConfirmationResult } from 'firebase/auth';

const KEYPAD: { label: string; sub?: string; value: string }[] = [
  { label: '1', sub: '', value: '1' },
  { label: '2', sub: 'ABC', value: '2' },
  { label: '3', sub: 'DEF', value: '3' },
  { label: '4', sub: 'GHI', value: '4' },
  { label: '5', sub: 'JKL', value: '5' },
  { label: '6', sub: 'MNO', value: '6' },
  { label: '7', sub: 'PQRS', value: '7' },
  { label: '8', sub: 'TUV', value: '8' },
  { label: '9', sub: 'WXYZ', value: '9' },
  { label: '*', value: '*' },
  { label: '0', sub: '+', value: '0' },
  { label: '#', value: '#' },
];

export default function LoginPage() {
  const router = useRouter();
  const { sendOTP, verifyOTP, login, isDemo, signInWithGoogle } = useAuth();

  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  const activeInput = step === 'phone' ? phone : otp;
  const maxLen = step === 'phone' ? 10 : 6;

  const handleKey = (val: string) => {
    if (val === '#') {
      if (step === 'phone') setPhone(p => p.slice(0, -1));
      else setOtp(p => p.slice(0, -1));
      return;
    }
    if (val === '*') return;
    if (activeInput.length >= maxLen) return;
    if (step === 'phone') setPhone(p => p + val);
    else setOtp(p => p + val);
  };

  const formatPhone = (p: string) => {
    const padded = p.padEnd(10, '_');
    return `${padded.slice(0, 5)} ${padded.slice(5)}`;
  };

  const handleSendOTP = async () => {
    if (phone.length < 10) {
      toast.error('Enter a valid 10-digit number');
      return;
    }
    setLoading(true);
    try {
      if (isDemo) {
        await new Promise(r => setTimeout(r, 800));
        toast.success('Demo mode — enter any 6 digits');
      } else {
        const conf = await sendOTP(`+91${phone}`, 'recaptcha-login');
        setConfirmation(conf);
        toast.success('OTP sent successfully');
      }
      setStep('otp');
    } catch (err: any) {
      toast.error(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otp.length !== 6) {
      toast.error('Enter 6-digit OTP');
      return;
    }
    setLoading(true);
    try {
      if (isDemo) {
        const store = getDemoStore();
        store.updateUser({ phone: `+91${phone}` });
        login(store.getUser());
        toast.success('Welcome to AgriTrade!');
      } else {
        const profile = await verifyOTP(confirmation, otp);
        login(profile);
        toast.success('Login successful!');
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
        login(profile);
        toast.success('Login successful!');
        router.push('/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-xl)', background: 'linear-gradient(135deg, var(--green-600), var(--green-700))', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Leaf size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk, sans-serif', color: 'var(--text-primary)' }}>AgriTrade</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Agri Credit Exchange</p>
        </div>

        <div className="card" style={{ padding: 24, marginBottom: 16 }}>
          {/* Phone display */}
          <div style={{ textAlign: 'center', marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>
              {step === 'phone' ? 'Enter Mobile Number' : `OTP sent to +91 ${phone}`}
            </div>
            {step === 'phone' ? (
              <div style={{ fontSize: 28, fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, letterSpacing: 2, color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: 18, marginRight: 6 }}>+91</span>
                {formatPhone(phone)}
              </div>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className={`otp-box ${otp[i] ? 'filled' : ''} ${i === otp.length && otp.length < 6 ? 'focused' : ''}`}
                  >
                    {otp[i] || ''}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Keypad */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 16 }}>
            {KEYPAD.map((k) => (
              <button
                key={k.value}
                className="key-btn"
                onClick={() => handleKey(k.value)}
                disabled={loading}
              >
                {k.value === '#' ? (
                  <Delete size={20} />
                ) : (
                  <>
                    {k.label}
                    {k.sub && <span className="key-sub">{k.sub}</span>}
                  </>
                )}
              </button>
            ))}
          </div>

          {/* Action button */}
          {step === 'phone' ? (
            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleSendOTP}
              disabled={loading || phone.length < 10}
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                className="btn btn-primary"
                style={{ width: '100%' }}
                onClick={handleVerifyOTP}
                disabled={loading || otp.length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify & Login'}
              </button>
              <button
                className="btn btn-ghost"
                style={{ width: '100%', fontSize: 13 }}
                onClick={() => { setStep('phone'); setOtp(''); }}
              >
                Change Number
              </button>
            </div>
          )}
        </div>

        {/* Google sign-in */}
        <button
          className="btn btn-outline"
          style={{ width: '100%', marginBottom: 16, background: 'var(--bg-surface)' }}
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          Sign in with Google
        </button>

        {/* Welcome bonus */}
        <div className="card-tinted" style={{ padding: 14, textAlign: 'center', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <Coins size={16} color="var(--amber-500)" />
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              New users get <strong style={{ color: 'var(--green-700)' }}>50 AC</strong> welcome bonus
            </span>
          </div>
        </div>

        {/* Register link */}
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
          New to AgriTrade?{' '}
          <Link href="/register" style={{ color: 'var(--green-600)', fontWeight: 600 }}>Create Account</Link>
        </p>

        {isDemo && (
          <p style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-faint)', marginTop: 8 }}>
            Demo Mode — any phone number & OTP will work
          </p>
        )}

        <div id="recaptcha-login" />
      </div>
    </div>
  );
}
