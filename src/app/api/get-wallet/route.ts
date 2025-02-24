"use server";

import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { wallets } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decryptPrivateKey } from "@/app/utility/decryptPrivateKey";
import { findUserByEmail } from "@/resources/user-queries";

export async function GET() {
    try {
        // Authenticate user
        const session = await auth();
        console.log(session)
        const useremail = session?.user?.email;

        if (!useremail) {
            return NextResponse.json({ success: false, error: "User not authenticated" }, { status: 401 });
        }

        const userData = await findUserByEmail(useremail);

        const userId = userData?.id;

        if (!userId) {
            return NextResponse.json({ success: false, error: "User ID not found" }, { status: 404 });
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

        // Decrypt the private key
        const privateKey = decryptPrivateKey({ encrypted: dataKey, authTag });
        
        return NextResponse.json({ success: true, wallet, privateKey });

    } catch (error) {
        console.error("Error fetching wallet:", error);
        return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
    }
}

