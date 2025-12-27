'use client';
import { useAccount, useConnect } from 'wagmi';

export default function WalletConnect() {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  return (
    <div>
      {!isConnected ? (
        <div>
          <button onClick={() => connect({ connector: connectors[0] })}>Connect MetaMask</button>
          <button onClick={() => connect({ connector: connectors[1] })}>Connect Base App/Coinbase</button>
        </div>
      ) : (
        <p>Connected: {address}</p>
      )}
    </div>
  );
}