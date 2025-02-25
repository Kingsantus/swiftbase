"use client";
import { ethers } from 'ethers';
import { useState } from 'react';

const SendMoneyComponent = () => {
  const [showSendDirect, setShowSendDirect] = useState(false);
  const [showGovernMoney, setShowGovernMoney] = useState(false);
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');

  const handleDirectSend = async () => {
  if (!ethers.isAddress(address)) {
    console.error("Invalid recipient address");
    return;
  }

  try {
    const response = await fetch("/api/send-direct", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address, amount }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Transaction successful:", data.txHash);
    } else {
      console.error("Transaction failed:", data.message);
    }
  } catch (error) {
    console.error("Error processing transaction:", error);
  }
};

  const handleProtectionSend = () => {
    // Handle the logic for governing money
    console.log('Governing money for:', address, 'Amount:', amount);
    // Add your logic here (e.g., API call, validation, etc.)
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Send Money</h2>
      <div className="flex gap-4">
        <button
          onClick={() => {
            setShowSendDirect(!showSendDirect);
            setShowGovernMoney(false); // Hide the other form
          }}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Send Direct
        </button>
        <button
          onClick={() => {
            setShowGovernMoney(!showGovernMoney);
            setShowSendDirect(false); // Hide the other form
          }}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Govern Your Money
        </button>
      </div>
      {(showSendDirect || showGovernMoney) && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Receiver Address"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full p-2 mb-2 border rounded"
          />
          {showSendDirect && (
            <button
              onClick={handleDirectSend}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit Direct Send
            </button>
          )}
          {showGovernMoney && (
            <button
              onClick={handleProtectionSend}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Submit Govern Money
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default SendMoneyComponent;