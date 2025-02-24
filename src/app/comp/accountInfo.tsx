"use client";

import { useEffect, useState } from "react";
import { ethers } from "ethers";
import AccountInfoComponent from "./accounts";
import { useSession } from "next-auth/react";

export default function AccountPage() {
    const [walletAddress, setWalletAddress] = useState<string | null>(null);
    const [balance, setBalance] = useState<number | null>(null);
    const [user, setUser] = useState<{ name: string; email: string } | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const { data: session, status } = useSession();

    useEffect(() => {
        if (!session?.user || status !== "authenticated") return;

        async function fetchWalletAndCheckBalance() {
            try {
                setLoading(true);

                // Fetch wallet details from the backend
                const response = await fetch("/api/get-wallet");
                const data = await response.json();

                if (!data.success) {
                    throw new Error(data.error || "Failed to retrieve wallet");
                }

                const { wallet } = data;
                setWalletAddress(wallet);
                if (session?.user) {
                    setUser({
                        name: session.user.name || "Unknown",
                        email: session.user.email || "Unknown"
                    });
                }

                // Set up provider
                const provider = new ethers.JsonRpcProvider(
                    `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
                );

                // Get balance directly from provider
                const balanceWei = await provider.getBalance(wallet);
                setBalance(parseFloat(ethers.formatEther(balanceWei)));

            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        }

        fetchWalletAndCheckBalance();
    }, [session, status]);

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
