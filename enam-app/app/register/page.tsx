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

// ── Cascading location data ──────────────────────────────────────────────────
const LOCATION_DATA: Record<string, Record<string, string[]>> = {
  'Andhra Pradesh': {
    'Guntur': ['Guntur City', 'Narasaraopet', 'Sattenapalle', 'Tenali'],
    'Krishna': ['Vijayawada', 'Machilipatnam', 'Gudivada', 'Nuzvid'],
    'Kurnool': ['Kurnool City', 'Nandyal', 'Adoni', 'Dhone'],
    'West Godavari': ['Eluru', 'Bhimavaram', 'Kovvur', 'Tanuku'],
  },
  'Assam': {
    'Kamrup': ['Guwahati', 'Hajo', 'Kamalpur', 'Rani'],
    'Dibrugarh': ['Dibrugarh', 'Naharkatia', 'Duliajan', 'Chabua'],
    'Nagaon': ['Nagaon', 'Hojai', 'Lumding', 'Doboka'],
  },
  'Bihar': {
    'Patna': ['Patna City', 'Bikram', 'Barh', 'Khusrupur'],
    'Gaya': ['Gaya City', 'Bodh Gaya', 'Aurangabad', 'Sherghati'],
    'Muzaffarpur': ['Muzaffarpur City', 'Sitamarhi', 'Sheohar', 'Motihari'],
    'Bhojpur': ['Ara', 'Piro', 'Sandesh', 'Jagdishpur'],
  },
  'Chhattisgarh': {
    'Raipur': ['Raipur City', 'Abhanpur', 'Arang', 'Tilda'],
    'Bilaspur': ['Bilaspur City', 'Katghora', 'Pendra', 'Mungeli'],
    'Durg': ['Durg City', 'Bhilai', 'Patan', 'Bemetara'],
  },
  'Gujarat': {
    'Ahmedabad': ['Ahmedabad City', 'Dholka', 'Dhandhuka', 'Bavla'],
    'Surat': ['Surat City', 'Bardoli', 'Mandvi', 'Navsari'],
    'Vadodara': ['Vadodara City', 'Karjan', 'Dabhoi', 'Padra'],
    'Anand': ['Anand City', 'Kheda', 'Nadiad', 'Petlad'],
  },
  'Haryana': {
    'Karnal': ['Karnal City', 'Gharaunda', 'Indri', 'Nilokheri'],
    'Hisar': ['Hisar City', 'Hansi', 'Narnaul', 'Fatehabad'],
    'Ambala': ['Ambala City', 'Naraingarh', 'Barara', 'Mullana'],
    'Rohtak': ['Rohtak City', 'Meham', 'Kalanaur', 'Makrauli'],
  },
  'Himachal Pradesh': {
    'Shimla': ['Shimla City', 'Rampur', 'Chopal', 'Theog'],
    'Kullu': ['Kullu City', 'Manali', 'Banjar', 'Anni'],
    'Kangra': ['Dharamshala', 'Palampur', 'Nurpur', 'Baijnath'],
  },
  'Jharkhand': {
    'Ranchi': ['Ranchi City', 'Kanke', 'Bundu', 'Tamar'],
    'Dhanbad': ['Dhanbad City', 'Jharia', 'Topchanchi', 'Sindri'],
    'Bokaro': ['Bokaro City', 'Chas', 'Bermo', 'Petarbar'],
  },
  'Karnataka': {
    'Bengaluru Urban': ['Bengaluru City', 'Anekal', 'Hoskote', 'Doddaballapura'],
    'Mysuru': ['Mysuru City', 'Nanjangud', 'Hunsur', 'Gundlupet'],
    'Belagavi': ['Belagavi City', 'Gokak', 'Nippani', 'Ramdurg'],
    'Dharwad': ['Dharwad City', 'Hubli', 'Kundgol', 'Navalgund'],
  },
  'Kerala': {
    'Thiruvananthapuram': ['Thiruvananthapuram City', 'Attingal', 'Varkala', 'Neyyattinkara'],
    'Ernakulam': ['Kochi City', 'Aluva', 'Perumbavoor', 'Muvattupuzha'],
    'Thrissur': ['Thrissur City', 'Chalakudy', 'Irinjalakuda', 'Guruvayur'],
    'Kozhikode': ['Kozhikode City', 'Vadakara', 'Koyilandy', 'Feroke'],
  },
  'Madhya Pradesh': {
    'Indore': ['Indore City', 'Depalpur', 'Mhow', 'Sanwer'],
    'Bhopal': ['Bhopal City', 'Berasia', 'Sehore', 'Mandideep'],
    'Ujjain': ['Ujjain City', 'Nagda', 'Mahidpur', 'Khachrod'],
    'Gwalior': ['Gwalior City', 'Dabra', 'Bhitarwar', 'Pichhore'],
  },
  'Maharashtra': {
    'Pune': ['Pune City', 'Haveli', 'Baramati', 'Shirur'],
    'Nagpur': ['Nagpur City', 'Kamthi', 'Hingna', 'Ramtek'],
    'Nashik': ['Nashik City', 'Niphad', 'Yeola', 'Sinnar'],
    'Aurangabad': ['Aurangabad City', 'Paithan', 'Kannad', 'Gangapur'],
  },
  'Odisha': {
    'Cuttack': ['Cuttack City', 'Athagarh', 'Salepur', 'Nischintakoili'],
    'Bhubaneswar': ['Bhubaneswar City', 'Balianta', 'Jatni', 'Khordha'],
    'Sambalpur': ['Sambalpur City', 'Rengali', 'Bargarh', 'Jharsuguda'],
  },
  'Punjab': {
    'Ludhiana': ['Ludhiana City', 'Khanna', 'Samrala', 'Raikot'],
    'Amritsar': ['Amritsar City', 'Attari', 'Ajnala', 'Baba Bakala'],
    'Jalandhar': ['Jalandhar City', 'Nakodar', 'Phillaur', 'Shahkot'],
    'Patiala': ['Patiala City', 'Nabha', 'Sangrur', 'Rajpura'],
  },
  'Rajasthan': {
    'Jaipur': ['Jaipur City', 'Chomu', 'Amber', 'Sanganer'],
    'Jodhpur': ['Jodhpur City', 'Phalodi', 'Bilara', 'Pipar'],
    'Kota': ['Kota City', 'Ladpura', 'Sangod', 'Ramganj Mandi'],
    'Ajmer': ['Ajmer City', 'Kishangarh', 'Beawar', 'Nasirabad'],
  },
  'Tamil Nadu': {
    'Chennai': ['Chennai City', 'Ambattur', 'Sholinganallur', 'Tambaram'],
    'Coimbatore': ['Coimbatore City', 'Pollachi', 'Tiruppur', 'Mettupalayam'],
    'Madurai': ['Madurai City', 'Melur', 'Thirumangalam', 'Usilampatti'],
    'Salem': ['Salem City', 'Omalur', 'Mettur', 'Attur'],
  },
  'Telangana': {
    'Hyderabad': ['Hyderabad City', 'Rangareddy', 'LB Nagar', 'Uppal'],
    'Warangal': ['Warangal City', 'Hanamkonda', 'Kazipet', 'Narsampet'],
    'Nalgonda': ['Nalgonda City', 'Suryapet', 'Miryalaguda', 'Nakrekal'],
  },
  'Tripura': {
    'West Tripura': ['Agartala', 'Mohanpur', 'Jirania', 'Majlishpur'],
    'North Tripura': ['Dharmanagar', 'Kailashahar', 'Kumarghat', 'Pecharthal'],
  },
  'Uttar Pradesh': {
    'Lucknow': ['Lucknow City', 'Mohanlalganj', 'Bakshi Ka Talab', 'Malihabad'],
    'Kanpur': ['Kanpur City', 'Ghatampur', 'Bilhaur', 'Bhitargaon'],
    'Agra': ['Agra City', 'Etmadpur', 'Kheragarh', 'Fatehabad'],
    'Varanasi': ['Varanasi City', 'Pindra', 'Bhadohi', 'Mirzapur'],
    'Meerut': ['Meerut City', 'Hapur', 'Modinagar', 'Sardhana'],
  },
  'Uttarakhand': {
    'Dehradun': ['Dehradun City', 'Rishikesh', 'Doiwala', 'Vikasnagar'],
    'Haridwar': ['Haridwar City', 'Roorkee', 'Laksar', 'Bhagwanpur'],
    'Nainital': ['Nainital City', 'Haldwani', 'Kashipur', 'Ramnagar'],
  },
  'West Bengal': {
    'Kolkata': ['Kolkata City', 'Howrah', 'Salt Lake', 'Dum Dum'],
    'Burdwan': ['Asansol', 'Durgapur', 'Burdwan City', 'Kalna'],
    'Murshidabad': ['Berhampore', 'Jangipur', 'Lalbagh', 'Domkal'],
    'North 24 Parganas': ['Barasat', 'Barrackpore', 'Basirhat', 'Bangaon'],
  },
  'Jammu & Kashmir': {
    'Jammu': ['Jammu City', 'Samba', 'Udhampur', 'Kathua'],
    'Srinagar': ['Srinagar City', 'Ganderbal', 'Budgam', 'Pulwama'],
    'Anantnag': ['Anantnag City', 'Bijbehara', 'Pahalgam', 'Kokernag'],
  },
};

const STATES = Object.keys(LOCATION_DATA).sort();

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
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('');
  const [district, setDistrict] = useState('');
  const [village, setVillage] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);

  // Derived district & village lists from selected state/district
  const districts = state ? Object.keys(LOCATION_DATA[state] || {}).sort() : [];
  const villages = state && district ? (LOCATION_DATA[state]?.[district] || []) : [];

  const handleStateChange = (s: string) => {
    setState(s);
    setDistrict('');
    setVillage('');
  };

  const handleDistrictChange = (d: string) => {
    setDistrict(d);
    setVillage('');
  };

  const canProceed = name.trim() && phone.length === 10 && state && district && village;

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
          village: `${village}, ${district}`,
          state,
          role: 'farmer',
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

  const handleGoogleSignIn = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent the event from bubbling up to any parent form/button
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      if (isDemo) {
        toast('Google sign-in is disabled in Demo Mode', { icon: 'ℹ️' });
      } else {
        const profile = await signInWithGoogle();
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

        {/* Benefits list (kept, the title/subtitle + gift card are removed) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
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

          <div className="card" style={{ padding: 28 }}>
            {step === 'details' ? (
              <>
                <h2 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk, sans-serif', marginBottom: 4 }}>Create Account</h2>
                <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Fill in your details to get started</p>

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

                {/* State */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>State</label>
                  <select
                    className="input"
                    value={state}
                    onChange={e => handleStateChange(e.target.value)}
                  >
                    <option value="">Select state</option>
                    {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                {/* District */}
                <div style={{ marginBottom: 16 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>District</label>
                  <select
                    className="input"
                    value={district}
                    onChange={e => handleDistrictChange(e.target.value)}
                    disabled={!state}
                    style={{ opacity: !state ? 0.5 : 1 }}
                  >
                    <option value="">{state ? 'Select district' : 'Select state first'}</option>
                    {districts.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                {/* Village */}
                <div style={{ marginBottom: 24 }}>
                  <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 6, display: 'block' }}>Village / Town</label>
                  <select
                    className="input"
                    value={village}
                    onChange={e => setVillage(e.target.value)}
                    disabled={!district}
                    style={{ opacity: !district ? 0.5 : 1 }}
                  >
                    <option value="">{district ? 'Select village/town' : 'Select district first'}</option>
                    {villages.map(v => <option key={v} value={v}>{v}</option>)}
                  </select>
                </div>

                {/* Send OTP button — disabled until phone is 10 digits */}
                <button
                  className="btn btn-primary btn-lg"
                  type="button"
                  style={{ width: '100%' }}
                  onClick={handleSendOTP}
                  disabled={loading || !canProceed || phone.length !== 10}
                >
                  {loading ? 'Sending OTP...' : <>Continue <ArrowRight size={16} /></>}
                </button>

                <div style={{ margin: '16px 0', textAlign: 'center', position: 'relative' }}>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: 0 }} />
                  <span style={{ background: 'var(--bg-canvas)', padding: '0 8px', fontSize: 13, color: 'var(--text-muted)', position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>or</span>
                </div>

                {/* Google sign-in — type="button" prevents form propagation */}
                <button
                  className="btn btn-outline"
                  type="button"
                  style={{ width: '100%', marginBottom: 4, background: 'var(--bg-surface)' }}
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
                  type="button"
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
                    {name} &middot; {village}, {district}, {state}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-lg"
                  type="button"
                  style={{ width: '100%' }}
                  onClick={handleVerify}
                  disabled={loading || otp.length !== 6}
                >
                  {loading ? 'Verifying...' : <>Verify &amp; Create Account <CheckCircle2 size={16} /></>}
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
