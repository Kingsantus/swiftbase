import { ethers } from "ethers";
import { auth } from "@/auth";
import { db } from "@/db";
import { transactions } from "@/db/schema";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";


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

    const provider = new ethers.JsonRpcProvider(
      `https://eth-sepolia.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`
    );

    const privateKey = process.env.NEXT_PRIVATE_API_KEY;
    if (!privateKey) {
      return NextResponse.json({ success: false, message: "Private key not defined" }, { status: 500 });
    }
    
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

    const tx = await contract.refund(ethers.toBigInt(transactionId));
    const receipt = await tx.wait();

    const parsedLogs: ethers.LogDescription[] = receipt.logs.map((log: ethers.Log) => contract.interface.parseLog(log));

    const event = parsedLogs.find(e => e.name === "TxRefunded");

    if (!event) {
        throw new Error("TxRefunded event not found!");
    }

    const refunded = ethers.formatEther(event.args[2]);

    try {
      const transaction = await db
        .update(transactions)
        .set({
          statusType: "completed",
          transactionHash: tx.hash,
          transactionId: null,
        })
        .where(eq(transactions.id, id)) // Ensure correct transaction update
        .returning({ id: transactions.id })
        .then((res) => res[0]);

      return NextResponse.json({
        success: true,
        txHash: tx.hash,
        transactionId: transaction?.id,
        amount: refunded
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
