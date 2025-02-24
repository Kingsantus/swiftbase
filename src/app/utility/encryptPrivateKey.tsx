import 'dotenv/config';
import crypto from "node:crypto";

interface EncryptedData {
  encrypted: string;
  authTag: string;
}

/**
 * Encrypts a private key and returns encrypted data + authentication tag
 * @param privateKey - The private key to encrypt
 * @returns Encrypted private key and auth tag
 */
export const encryptPrivateKey = ({ privateKey }: { privateKey: string }): EncryptedData => {
  if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
    throw new Error("Encryption key and IV must be set in environment variables.");
  }

  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  let encrypted = cipher.update(privateKey, "utf8", "hex");
  encrypted += cipher.final("hex");
  const authTag = cipher.getAuthTag().toString("hex");

  return { encrypted, authTag };
};
