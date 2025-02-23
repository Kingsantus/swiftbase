"use client";

import { useState } from 'react';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  status: string;
}

  interface TransactionProps {
    transactions: Transaction[];
  }

  const TransactionComponent: React.FC<TransactionProps> = ({ transactions }) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

const handleTransactionClick = (transaction: Transaction): void => {
    setSelectedTransaction(transaction);
};

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            onClick={() => handleTransactionClick(transaction)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            <div className="flex justify-between">
              <span>{transaction.description}</span>
              <span>{transaction.amount} BTC</span>
            </div>
            {selectedTransaction?.id === transaction.id && transaction.status === 'pending' && (
              <div className="flex gap-2 mt-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded">Release</button>
                <button className="px-4 py-2 bg-gray-500 text-white rounded">Refund</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionComponent;