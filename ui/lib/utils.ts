import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import * as crypto from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Encryption and decryption constants
const algorithm = "aes-256-cbc";
const key = "mypasswith32chars>>AES_256_bytes"; // Must be 32 bytes for AES-256
const iv = crypto.randomBytes(16); // Initialization vector

// Type for the encrypted data
export interface EncryptedData {
  iv: string;
  encryptedData: string;
}

/**
 * Encrypts a given text using AES-256-CBC.
 *
 * @param text - The plaintext to encrypt.
 * @returns Encrypted data containing the IV and ciphertext.
 */
export function encrypt(text: string): EncryptedData {
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf8");
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString("hex"), encryptedData: encrypted.toString("hex") };
}

/**
 * Decrypts encrypted data back to plaintext.
 *
 * @param data - The encrypted data containing the IV and ciphertext.
 * @returns The decrypted plaintext as a string.
 */
export function decrypt(data: EncryptedData): string {
  const ivBuffer = Buffer.from(data.iv, "hex");
  const encryptedText = Buffer.from(data.encryptedData, "hex");
  const decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), ivBuffer);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString("utf8");
}
