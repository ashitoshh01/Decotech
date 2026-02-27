'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface WalletState {
  available: number;
  locked: number;
  hasDecayRisk: boolean;
  refreshWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletState>({
  available: 0, locked: 0, hasDecayRisk: false, refreshWallet: async () => {},
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const { profile, refreshProfile } = useAuth();
  const [available, setAvailable] = useState(0);
  const [locked, setLocked] = useState(0);
  const [hasDecayRisk, setHasDecayRisk] = useState(false);

  useEffect(() => {
    if (profile) {
      setAvailable(profile.agriCredits);
      setLocked(profile.lockedCredits);
      if (profile.lastTransactionDate) {
        const diff = Date.now() - new Date(profile.lastTransactionDate).getTime();
        setHasDecayRisk(diff > 365 * 24 * 3600000);
      } else {
        setHasDecayRisk(false);
      }
    }
  }, [profile]);

  const refreshWallet = useCallback(async () => {
    await refreshProfile();
  }, [refreshProfile]);

  return (
    <WalletContext.Provider value={{ available, locked, hasDecayRisk, refreshWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => useContext(WalletContext);
