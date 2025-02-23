"use client";
import { useState } from 'react';

const SendMoneyComponent = () => {
  const [showSendDirect, setShowSendDirect] = useState(false);
  const [showGovernMoney, setShowGovernMoney] = useState(false);

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Send Money</h2>
      <div className="flex gap-4">
        <button
          onClick={() => setShowSendDirect(!showSendDirect)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Send Direct
        </button>
        <button
          onClick={() => setShowGovernMoney(!showGovernMoney)}
          className="px-4 py-2 bg-purple-500 text-white rounded"
        >
          Govern Your Money
        </button>
      </div>
      {(showSendDirect || showGovernMoney) && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-700 rounded-lg">
          <input
            type="text"
            placeholder="Receiver Address"
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="number"
            placeholder="Amount"
            className="w-full p-2 mb-2 border rounded"
          />
          <button className="px-4 py-2 bg-blue-500 text-white rounded">Submit</button>
        </div>
      )}
    </div>
  );
};

export default SendMoneyComponent;