import { http, createConfig } from '@wagmi/core';
import { base } from 'viem/chains'; // Base chain из viem
import { injected, walletConnect } from '@wagmi/connectors';

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  connectors: [
    injected({ target: 'metaMask' }), // Для MetaMask
    injected({ target: 'coinbaseWallet' }), // Для Coinbase Wallet/Base App
  ],
});