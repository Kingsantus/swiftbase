import 'dotenv/config';
import crypto from "node:crypto";

/**
 * Decrypts an encrypted private key using AES-256-GCM
 * @param encrypted - The encrypted private key
 * @param authTag - The authentication tag used for verification
 * @returns The original private key as a string
 */
export const decryptPrivateKey = ({
  encrypted,
  authTag,
}: {
  encrypted: string;
  authTag: string;
}): string => {
  if (!process.env.ENCRYPTION_KEY || !process.env.ENCRYPTION_IV) {
    throw new Error("Encryption key and IV must be set in environment variables.");
  }

  const key = Buffer.from(process.env.ENCRYPTION_KEY, "hex");
  const iv = Buffer.from(process.env.ENCRYPTION_IV, "hex");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(Buffer.from(authTag, "hex"));

  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
};
