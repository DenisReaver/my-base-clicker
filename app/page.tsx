'use client';

import { useEffect, useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseGwei } from 'viem';
import WalletConnect from './components/WalletConnect';
import ClickerABI from './abi/ClickerABI.json'; // Путь к ABI

const CONTRACT_ADDRESS = '0xFf3F7a0e0623b7dcf639c12bA39beF636857Bc62'; // ← Замени на реальный адрес!

export default function Home() {
  const [gasPrice, setGasPrice] = useState(1); // Цена в gwei

  const { address, isConnected } = useAccount();

  // Чтение счётчика on-chain
  const { data: clickCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: ClickerABI,
    functionName: 'getClickCount',
  });

  // Вызов функции click()
  const {
    writeContract,
    data: hash,
    isPending: isSending,
    error: sendError,
  } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
  } = useWaitForTransactionReceipt({ hash });

  const handleClick = async () => {
    if (!isConnected || !address) {
      alert('Сначала подключите кошелёк!');
      return;
    }

    writeContract({
      address: CONTRACT_ADDRESS,
      abi: ClickerABI,
      functionName: 'click',
      args: [], // Нет аргументов
      maxFeePerGas: parseGwei(gasPrice.toString()),
    });
  };

  // После подтверждения обновляем счётчик
  useEffect(() => {
    if (isConfirmed) {
      refetchCount(); // Перезагружаем счётчик
      alert('Клик засчитан on-chain!');
    }
  }, [isConfirmed, refetchCount]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-800">Base On-Chain Clicker</h1>

        <WalletConnect />

        {isConnected && (
          <>
            <p className="text-lg">Кликов on-chain: <span className="font-bold text-blue-600">{Number(clickCount) || 0}</span></p>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Цена транзакции (maxFeePerGas в gwei):
              </label>
              <input
                type="number"
                min="0.01"
                step="0.1"
                value={gasPrice}
                onChange={(e) => setGasPrice(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={handleClick}
              disabled={isSending || isConfirming}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold rounded-lg transition disabled:cursor-not-allowed"
            >
              {isSending ? 'Отправка...' : isConfirming ? 'Ожидание подтверждения...' : 'Клик → Вызвать click()'}
            </button>

            {hash && (
              <div className="text-sm break-all bg-gray-100 p-3 rounded">
                Хэш: <a href={`https://basescan.org/tx/${hash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  {hash}
                </a>
              </div>
            )}

            {sendError && (
              <p className="text-red-600">
                Ошибка: {sendError.message}
              </p>
            )}

            {isConfirmed && (
              <p className="text-green-600 font-medium">
                Транзакция подтверждена! Счётчик обновлён.
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}