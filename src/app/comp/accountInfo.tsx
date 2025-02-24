"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AccountInfoComponent from "./accounts";


export default function AccountPage() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchWalletAndCheckBalance() {
            try {
                // Fetch wallet details from the backend
                const response = await fetch("/api/get-wallet");
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || "Failed to retrieve wallet");
                }

                const { wallet, privateKey } = data;

                // Fetch user data from session
                const sessionRes = await fetch("/api/get-user"); // Assumes you have a `/api/get-user` route
                const sessionData = await sessionRes.json();
                setUser(sessionData.user);

                // Set up provider
                const provider = new ethers.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_API_KEY}`);
                
                // Create wallet instance
                const walletInstance = new ethers.Wallet(privateKey, provider);
                setWalletAddress(wallet);

                // Get balance
                const balanceWei = await walletInstance.getBalance();
                setBalance(parseFloat(ethers.formatEther(balanceWei)));

            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchWalletAndCheckBalance();
    }, []);

    if (loading) return <p>Loading account details...</p>;
    if (error) return <p className="text-red-500">Error: {error}</p>;

    return (
        <div className="p-6">
            {walletAddress && balance !== null && user ? (
                <AccountInfoComponent walletAddress={walletAddress} balance={balance} user={user} />
            ) : (
                <p>Failed to load account information.</p>
            )}
        </div>
    );
}
