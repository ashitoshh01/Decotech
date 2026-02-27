'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User, ConfirmationResult, RecaptchaVerifier, signInWithPhoneNumber, signOut as fbSignOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, DEMO_MODE } from '@/lib/firebase/config';
import { getDemoStore } from '@/lib/demo-store';
import { CREDIT_REWARDS } from '@/lib/agriCredit';
import { UserProfile } from '@/types';

interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (p: UserProfile) => void;
  logout: () => void;
  sendOTP: (phone: string, containerId: string) => Promise<ConfirmationResult | null>;
  verifyOTP: (conf: ConfirmationResult | null, otp: string) => Promise<UserProfile>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
  signInWithGoogle: () => Promise<UserProfile>;
}

const AuthContext = createContext<AuthState>({
  user: null, profile: null, loading: true, isDemo: false,
  login: () => { }, logout: () => { },
  sendOTP: async () => null,
  verifyOTP: async () => ({} as UserProfile),
  updateProfile: async () => { },
  refreshProfile: async () => { },
  signInWithGoogle: async () => ({} as UserProfile),
});

async function fetchProfile(uid: string): Promise<UserProfile | null> {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) return null;
  const d = snap.data();
  return {
    ...d,
    uid,
    lastTransactionDate: d.lastTransactionDate?.toDate?.()?.toISOString?.() || d.lastTransactionDate || null,
    createdAt: d.createdAt?.toDate?.()?.toISOString?.() || d.createdAt || new Date().toISOString(),
  } as UserProfile;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (DEMO_MODE) { setLoading(false); return; }
    if (!auth) { setLoading(false); return; }
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        const p = await fetchProfile(u.uid);
        setProfile(p);
      } else {
        setProfile(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const login = (p: UserProfile) => setProfile(p);

  const logout = () => {
    setProfile(null);
    setUser(null);
    if (!DEMO_MODE && auth) fbSignOut(auth);
  };

  const sendOTP = async (phone: string, containerId: string): Promise<ConfirmationResult | null> => {
    if (DEMO_MODE || !auth) return null;

    try {
      if (!(window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, containerId, { size: 'invisible' });
      }
      return await signInWithPhoneNumber(auth, phone, (window as any).recaptchaVerifier);
    } catch (error) {
      if ((window as any).recaptchaVerifier) {
        try { (window as any).recaptchaVerifier.clear(); } catch (e) { }
        (window as any).recaptchaVerifier = undefined;
      }
      throw error;
    }
  };

  const verifyOTP = async (conf: ConfirmationResult | null, otp: string): Promise<UserProfile> => {
    if (DEMO_MODE) {
      const store = getDemoStore();
      const u = store.getUser();
      setProfile(u);
      return u;
    }
    if (!conf || !db) throw new Error('Not configured');
    const result = await conf.confirm(otp);
    const u = result.user;
    const ref = doc(db, 'users', u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const newProfile: Omit<UserProfile, 'uid'> = {
        phone: u.phoneNumber || '',
        name: '',
        village: '',
        state: '',
        role: 'farmer',
        agriCredits: CREDIT_REWARDS.referral_new_farmer,
        lockedCredits: 0,
        verified: false,
        verificationCount: 0,
        trustScore: 50,
        totalTrades: 0,
        lastTransactionDate: null,
        createdAt: new Date().toISOString(),
      };
      await setDoc(ref, { ...newProfile, createdAt: serverTimestamp(), lastTransactionDate: serverTimestamp() });
      const p = { ...newProfile, uid: u.uid };
      setProfile(p);
      return p;
    }
    const p = await fetchProfile(u.uid);
    return p!;
  };

  const signInWithGoogle = async (): Promise<UserProfile> => {
    if (DEMO_MODE || !auth || !db) throw new Error('Not configured');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const u = result.user;
    const ref = doc(db, 'users', u.uid);
    const snap = await getDoc(ref);
    if (!snap.exists()) {
      const newProfile: Omit<UserProfile, 'uid'> = {
        phone: u.phoneNumber || '',
        name: u.displayName || '',
        village: '',
        state: '',
        role: 'farmer',
        agriCredits: CREDIT_REWARDS.referral_new_farmer,
        lockedCredits: 0,
        verified: false,
        verificationCount: 0,
        trustScore: 50,
        totalTrades: 0,
        lastTransactionDate: null,
        createdAt: new Date().toISOString(),
      };
      await setDoc(ref, { ...newProfile, photoURL: u.photoURL, email: u.email, createdAt: serverTimestamp(), lastTransactionDate: serverTimestamp() });
      const p = { ...newProfile, photoURL: u.photoURL, email: u.email, uid: u.uid } as unknown as UserProfile;
      setProfile(p);
      return p;
    }
    const p = await fetchProfile(u.uid);
    setProfile(p);
    return p!;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!profile) return;
    if (DEMO_MODE) {
      const store = getDemoStore();
      store.updateUser(updates as any);
      setProfile(prev => prev ? { ...prev, ...updates } : prev);
    } else if (db) {
      await setDoc(doc(db, 'users', profile.uid), updates, { merge: true });
      setProfile(prev => prev ? { ...prev, ...updates } : prev);
    }
  };

  const refreshProfile = async () => {
    if (DEMO_MODE && profile) {
      const store = getDemoStore();
      setProfile(store.getUser());
    } else if (user) {
      const p = await fetchProfile(user.uid);
      if (p) setProfile(p);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, isDemo: DEMO_MODE, login, logout, sendOTP, verifyOTP, updateProfile, refreshProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
