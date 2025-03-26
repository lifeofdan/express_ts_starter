import { generateKeySync } from "node:crypto"

export function generateRawBytes (length: number): string {
  return generateKeySync("hmac", { length }).export().toString('hex');
}