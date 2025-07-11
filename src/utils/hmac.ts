// third-party
import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

// types
type HmacSignature = {
  signature: string;
  timestamp: string;
  nonce: string;
  rawBody: string;
};

// ==============================|| HMAC HEADERS GENERATOR ||============================== //

export function generateHmacHeaders(
  body: unknown,
  secret: string
): HmacSignature {
  const rawBody = JSON.stringify(body);
  const nonce = uuidv4();
  const timestamp = Date.now().toString();
  const input = `${timestamp}:${nonce}:${rawBody}`;
  const signature = crypto
    .createHmac("sha256", secret)
    .update(input)
    .digest("hex");

  return {
    signature,
    timestamp,
    nonce,
    rawBody,
  };
}
