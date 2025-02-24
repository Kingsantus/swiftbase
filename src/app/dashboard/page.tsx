"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import SendMoneyComponent from "../comp/sendFund";
import TransactionComponent from "../comp/transactions";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import AccountPage from "../comp/accountInfo";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login"); // Redirect if not logged in
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex justify-center items-center h-screen">
                <Button size="sm" variant="ghost" disabled>
                    <Loader2 className="animate-spin w-6 h-6" />
                </Button>
            </div>
        );
    }

    if (!session?.user) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                <p>User not found. Please log in.</p>
            </div>
        );
    }

    const transactions = [
        { id: '1', description: 'Sent to Alice', amount: 0.1, status: 'pending' },
        { id: '2', description: 'Received from Bob', amount: 0.5, status: 'received' },
        { id: '3', description: 'Sent to Charlie', amount: 0.2, status: 'pending' },
    ];
    

    // const walletAddress = '0x1234...abcd';
    // const balance = 1.5;

    return (
        <div className="flex justify-center items-center min-h-screen px-4 dark:bg-black dark:text-white">
            <div className="w-full max-w-4xl py-10 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-4">
                        <AccountPage />
                        {/* <AccountInfoComponent 
                            // walletAddress={walletAddress} 
                            // balance={balance} 
                            // user={{ 
                            //     name: session.user?.name ?? 'Unknown User', 
                            //     email: session.user?.email ?? 'No email available' 
                            // }} 
                        /> */}
                        <SendMoneyComponent />
                        <TransactionComponent transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
