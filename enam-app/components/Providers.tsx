'use client';

import { AuthProvider } from '@/context/AuthContext';
import { WalletProvider } from '@/context/WalletContext';
import { ChatProvider } from '@/context/ChatContext';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <WalletProvider>
        <ChatProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: {
                borderRadius: '12px',
                background: '#14532d',
                color: '#fff',
                fontSize: '14px',
              },
            }}
          />
        </ChatProvider>
      </WalletProvider>
    </AuthProvider>
  );
}
