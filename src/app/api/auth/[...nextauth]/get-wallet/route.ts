"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { wallets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { ethers } from "ethers";
import { decryptPrivateKey } from "@/app/utility/decryptPrivateKey";

export async function GET() {
    try {
        // Authenticate user
        const session = await auth();
        const userId = session?.user?.id;

        if (!userId) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }

        // Fetch wallet data
        const walletData = await db
            .select({ dataKey: wallets.datakey, authTag: wallets.authTag, wallet: wallets.wallet })
            .from(wallets)
            .where(eq(wallets.userId, userId))
            .then(res => res[0]);

        if (!walletData) {
            return NextResponse.json({ success: false, error: "Wallet not found" }, { status: 404 });
        }

        const { dataKey, authTag, wallet } = walletData;

        if (!process.env.API_KEY || !process.env.KEY || !process.env.IV) {
            return NextResponse.json({ success: false, error: "Missing environment variables" }, { status: 500 });
        }

        // Decrypt the private key
        const privateKey = decryptPrivateKey({ encrypted: dataKey, authTag });
        
        return NextResponse.json({ success: true, wallet, privateKey });

    } catch (error) {
        console.error("Error fetching wallet:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

