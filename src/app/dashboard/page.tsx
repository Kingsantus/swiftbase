"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AccountInfoComponent from "../comp/accounts";
import SendMoneyComponent from "../comp/sendFund";
import TransactionComponent from "../comp/transactions";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";

export default function Dashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    console.log("Session:", session);
console.log("Status:", status);

    useEffect(() => {
        if (status === "unauthenticated") {
            // router.push("/login"); // Redirect if not logged in
        }
    }, [status, router]);

    if (status === "loading") {
        return <li>
            <Button size="sm" variant="ghost">
                <Loader2Icon className="min-w-[8-ch]"></Loader2Icon>
            </Button>
        </li>;
    }

    if (!session?.user) return null; // Prevent rendering if session is missing

    const transactions = [
        { id: '1', description: 'Sent to Alice', amount: 0.1, status: 'pending' },
        { id: '2', description: 'Received from Bob', amount: 0.5, status: 'receive' },
        { id: '3', description: 'Sent to Charlie', amount: 0.2, status: 'pending' },
    ];

    const walletAddress = '0x1234...abcd';
    const balance = 1.5;

    return (
        <div className="flex justify-center items-center min-h-screen px-4 dark:bg-black dark:text-white">
            <div className="w-full max-w-4xl py-10 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-4">
                        <AccountInfoComponent 
                            walletAddress={walletAddress} 
                            balance={balance} 
                            user={{ 
                                name: session.user?.name ?? 'Unknown User', 
                                email: session.user?.email ?? 'No email available' 
                            }} 
                        />
                        <SendMoneyComponent />
                        <TransactionComponent transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
