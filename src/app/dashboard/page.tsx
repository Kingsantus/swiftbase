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

    return (
        <div className="flex justify-center items-center min-h-screen px-4 dark:bg-black dark:text-white">
            <div className="w-full max-w-4xl py-10 lg:py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 gap-4">
                        <AccountPage />
                        <SendMoneyComponent />
                        <TransactionComponent />
                    </div>
                </div>
            </div>
        </div>
    );
}
