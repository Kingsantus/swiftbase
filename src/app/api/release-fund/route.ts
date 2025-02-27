import { ethers } from "ethers";
import { auth } from "@/auth";
import { db } from "@/db";
import { wallets, transactions } from "@/db/schema";
import { findUserByEmail } from "@/resources/user-queries";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { decryptPrivateKey } from "@/app/utility/decryptPrivateKey";


export async function POST(req: Request) {
  try {
    const { id, transactionId } = await req.json();

    if (
      !id || !transactionId
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid input" },
        { status: 400 }
      );
    }

    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ success: false, message: "User not authenticated" }, { status: 401 });
    }

    const user = await findUserByEmail(session.user.email);
    if (!user?.id) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    // Fetch wallet data
    const walletData = await db
      .select({
        id: wallets.id,
        dataKey: wallets.datakey,
        authTag: wallets.authTag,
      })
      .from(wallets)
      .where(eq(wallets.userId, user.id))
      .then(res => res[0])

    if (!walletData) {
      return NextResponse.json({ success: false, message: "Wallet not found" }, { status: 404 });
    }

    const { dataKey, authTag } = walletData;

    // Decrypt private key
    let privateKey;
    try {
      privateKey = decryptPrivateKey({ encrypted: dataKey, authTag });
    } catch {
      return NextResponse.json({ success: false, message: "Failed to decrypt wallet" }, { status: 500 });
    }

    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );

    const signer = new ethers.Wallet(privateKey, provider);

    const contractAddress = process.env.NEXT_CONTRACT_ADDRESS;
    if (!contractAddress) {
      return NextResponse.json({ success: false, message: "Contract address not defined" }, { status: 500 });
    }

    const abiBase64 = process.env.NEXT_PUBLIC_CONTRACT_ABI;
    if (!abiBase64) {
      return NextResponse.json({ success: false, message: "Contract ABI not defined" }, { status: 500 });
    }
    const abi = JSON.parse(Buffer.from(abiBase64, "base64").toString("utf-8"));


    const contract = new ethers.Contract(contractAddress, abi, signer);

    const tx = await contract.release(ethers.toBigInt(transactionId));
    const receipt = await tx.wait();

    const parsedLogs: ethers.LogDescription[] = receipt.logs.map((log: ethers.Log) => contract.interface.parseLog(log));

    const event = parsedLogs.find(e => e.name === "TxReleased");

    if (!event) {
        throw new Error("TxReleased event not found!");
    }

    try {
      const transaction = await db
        .update(transactions)
        .set({
          statusType: "completed",
          transactionHash: tx.hash,
          transactionId: null,
        })
        .where(eq(transactions.id, id))
        .returning({ id: transactions.id })
        .then((res) => res[0]);

      return NextResponse.json({
        success: true,
        txHash: tx.hash,
        transactionId: transaction?.id,
      });
    } catch (dbError) {
      console.error("Database update error:", dbError);
      return NextResponse.json({ success: false, message: "Failed to record transaction" }, { status: 500 });
    }

    } catch (error) {
      console.error("Transaction error:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }
