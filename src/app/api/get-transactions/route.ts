"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { findUserByEmail } from "@/resources/user-queries";

export async function GET() {
    try {
        // Authenticate user
        const session = await auth();
        const userEmail = session?.user?.email;

        if (!userEmail) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }

        // Fetch user data
        const userData = await findUserByEmail(userEmail);
        if (!userData?.id) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        // Fetch user transactions
        const transactionData = await db
            .select({
                id: transactions.id,
                amount: transactions.amount,
                type: transactions.transactionType,
                status: transactions.statusType,
                transactionId: transactions.transactionId,
                txHash: transactions.transactionHash,
                date: transactions.createdAt,
            })
            .from(transactions)
            .where(eq(transactions.userId, userData.id));

        return NextResponse.json({ success: true, transactions: transactionData });

    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}