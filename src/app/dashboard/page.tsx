import { auth } from "@/auth";
import AccountInfoComponent from "../comp/accounts";
import SendMoneyComponent from "../comp/sendFund";
import TransactionComponent from "../comp/transactions";

export default async function Dashboard() {
    const session = await auth();
    console.log(session);

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
                        <AccountInfoComponent walletAddress={walletAddress} balance={balance} />
                        <SendMoneyComponent />
                        <TransactionComponent transactions={transactions} />
                    </div>
                </div>
            </div>
        </div>
    );
}
