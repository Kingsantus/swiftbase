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
    const { address, amount } = await req.json();

    // Ensure amount is a valid number
    const parsedAmount = parseFloat(amount);

    if (
      !ethers.isAddress(address) ||
      isNaN(parsedAmount) ||
      parsedAmount <= 0
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

    const { dataKey, authTag, id: walletId } = walletData;

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
    const balanceWei = await provider.getBalance(signer.address);
    const balanceEther = ethers.formatEther(balanceWei); // Keep as string to avoid precision loss

    if (parseFloat(balanceEther) < amount) {
      return NextResponse.json({ success: false, message: "Insufficient balance" }, { status: 400 });
    }

    // Send transaction
    const ethTransaction = await signer.sendTransaction({
      to: address,
      value: ethers.parseUnits(amount.toString(), "ether"),
    });

    await ethTransaction.wait();

    try {
      const transaction = await db.insert(transactions)
        .values({
          userId: user?.id,
          walletId,
          transactionType: "send",
          statusType: "completed",
          receiverWallet: address,
          amount,
          transactionHash: ethTransaction.hash,
        })
        .returning({ id: transactions.id }) // Get the inserted transaction ID
        .then((res) => res[0]); // Extract the first result

      return NextResponse.json({
        success: true,
        txHash: ethTransaction.hash,
        transactionId: transaction?.id,
      });
    } catch (dbError) {
      console.error("Database insert error:", dbError);
      return NextResponse.json({ success: false, message: "Failed to record transaction" }, { status: 500 });
    }

    } catch (error) {
      console.error("Transaction error:", error);
      return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
    }
  }
