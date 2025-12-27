import { http, createConfig } from '@wagmi/core';
import { base, baseSepolia } from 'viem/chains';
import { injected, walletConnect } from '@wagmi/connectors';

// WalletConnect — лучший способ для Base App
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) {
  throw new Error('NEXT_PUBLIC_WC_PROJECT_ID не задан в .env.local!');
}

export const config = createConfig({
  chains: [base], // Для тестов замени на baseSepolia
  transports: {
    [base.id]: http(),
  },
  connectors: [
    // MetaMask (работает как раньше)
    injected({ target: 'metaMask' }),

    // WalletConnect — идеально для Base App и других мобильных кошельков
    walletConnect({
      projectId,
    }),
  ],
});
