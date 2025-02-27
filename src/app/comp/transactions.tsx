"use client";

import { useState, useEffect } from "react";

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  transactionId: string;
  date: string;
  txHash: string;
}

const TransactionComponent: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingTransactions, setProcessingTransactions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchTransactions = async () => {
      setError(null); // Reset error before fetching
      try {
        const response = await fetch("/api/get-transactions");
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data.transactions || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleTransactionClick = (transaction: Transaction): void => {
    setSelectedTransaction(transaction);
  };

  const handleRelease = async (id: string, transactionId: string)  => {
    setProcessingTransactions((prev) => ({ ...prev, [transactionId]: true }));
    try {
      const response = await fetch("/api/release-fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, transactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process transaction");
      }
      alert("Release successful!");

      // Update transaction status in local state
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) =>
          tx.transactionId === transactionId ? { ...tx, status: "completed" } : tx
        )
      );
      setSelectedTransaction(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessingTransactions((prev) => ({ ...prev, [transactionId]: false }));
    }
  };

  const handleRefund = async (id: string, transactionId: string) => {
    setProcessingTransactions((prev) => ({ ...prev, [transactionId]: true }));
    try {
      const response = await fetch("/api/refund-fund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, transactionId }),
      });

      if (!response.ok) {
        throw new Error("Failed to process transaction");
      }
      const data = await response.json();
      alert(`Refunded ${data.amount} was successful!`);

      // Update transaction status in local state
      setTransactions((prevTransactions) =>
        prevTransactions.map((tx) =>
          tx.transactionId === transactionId ? { ...tx, status: "completed" } : tx
        )
      );
      setSelectedTransaction(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProcessingTransactions((prev) => ({ ...prev, [transactionId]: false }));
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Transactions</h2>
      <ul className="space-y-2">
        {transactions.map((transaction) => (
          <li
            key={transaction.id}
            onClick={() => handleTransactionClick(transaction)}
            className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded cursor-pointer"
          >
            <div className="flex justify-between">
              <span className="font-medium">{transaction.type}</span>
              <span>{transaction.amount} ETH</span>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">{transaction.status}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              <a href={`https://sepolia.etherscan.io/tx/${transaction.txHash}`} target="_blank" rel="noopener noreferrer"
              className="text-blue-500 cursor-pointer no-underline hover:underline" >
                Check Transaction on Explorer</a>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(transaction.date).toLocaleString()}
            </div>

            {selectedTransaction?.id === transaction.id && transaction.status === "pending" && (
              <div className="flex gap-2 mt-2">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
                  disabled={processingTransactions[transaction.transactionId]}
                  onClick={() => handleRelease(transaction.id, transaction.transactionId)}
                >
                  {processingTransactions[transaction.transactionId] ? "Processing..." : "Release Fund"}
                </button>
                <button
                  className="px-4 py-2 bg-gray-500 text-white rounded disabled:opacity-50"
                  disabled={processingTransactions[transaction.transactionId]}
                  onClick={() => handleRefund(transaction.id, transaction.transactionId)}
                >
                  {processingTransactions[transaction.transactionId] ? "Processing..." : "Refund Me"}
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TransactionComponent;
