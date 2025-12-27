'use client';

import { useConnect, useAccount } from 'wagmi';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();

  // Фильтруем только нужные коннекторы
  const availableConnectors = connectors.filter(
    (c) => c.id === 'metaMask' || c.id === 'walletConnect'
  );

  if (isConnected) {
    return (
      <div className="text-center">
        <p className="text-green-600 font-medium">
          Подключено: {address?.slice(0, 6)}...{address?.slice(-4)}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {availableConnectors.map((connector) => (
        <button
          key={connector.id}
          onClick={() => connect({ connector })}
          className="w-full py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition"
        >
          {connector.id === 'metaMask' ? 'Подключить MetaMask' : 'Подключить через WalletConnect (Base App, Trust Wallet и др.)'}
        </button>
      ))}
    </div>
  );
}
