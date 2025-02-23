"use client";

interface AccountInfoProps {
  walletAddress: string;
  balance: number;
  user: { name: string; email: string };
}

const AccountInfoComponent: React.FC<AccountInfoProps> = ({ walletAddress, balance, user }) => {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("Wallet Address Copied!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h2 className="text-lg font-semibold mb-4">Account Info</h2>
      <div className="space-y-2">
        <p>Name: {user.name}</p>
        <p>Email: {user.email}</p>
        <p
          className="cursor-pointer text-blue-500 hover:underline"
          onClick={() => copyToClipboard(walletAddress)}
        >
          Wallet Address: {walletAddress}
        </p>
        <p>Balance: {balance} ETH</p>
      </div>
    </div>
  );
};

export default AccountInfoComponent;
