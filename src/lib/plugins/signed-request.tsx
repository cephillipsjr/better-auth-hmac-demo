// third-party
import { BetterAuthPlugin, createAuthMiddleware } from "better-auth/plugins";
import { APIError } from "better-auth/api";
import crypto from "crypto";

// project imports
import { redis } from "@/utils/redis";

const NONCE_TTL_MS = parseInt(process.env.NONCE_TIME_TO_LIVE || "300000", 10);

// ==============================|| BETTER AUTH SIGNED REQUEST PLUGIN ||============================== //
export const signedRequestPlugin = (): BetterAuthPlugin => ({
  id: "signed-request",
  hooks: {
    before: [
      {
        matcher: (ctx) => ctx.path?.startsWith("/"),
        handler: createAuthMiddleware(async (ctx) => {
          const signature = ctx.headers?.get(
            process.env.HMAC_HEADER_SIGNATURE || "x-signature"
          );
          const timestamp = ctx.headers?.get(
            process.env.HMAC_HEADER_TIMESTAMP || "x-timestamp"
          );
          const nonce = ctx.headers?.get(
            process.env.HMAC_HEADER_NONCE || "x-nonce"
          );
          const secret = process.env.SIGNED_SECRET;

          if (!signature || !timestamp || !nonce || !secret) {
            throw new APIError("UNAUTHORIZED", {
              status: 401,
              message: "Missing HMAC headers",
            });
          }

          const now = Date.now();
          const reqTs = parseInt(timestamp, 10);

          if (isNaN(reqTs) || Math.abs(now - reqTs) > NONCE_TTL_MS) {
            throw new APIError("UNAUTHORIZED", {
              status: 401,
              message: "Request too old",
            });
          }

          if (await isNonceUsed(nonce)) {
            throw new APIError("UNAUTHORIZED", {
              status: 401,
              message: "Replay attack detected",
            });
          }

          const rawBody = JSON.stringify(ctx.body ?? {});

          if (
            !verifyHMAC({
              body: rawBody,
              signature,
              nonce,
              timestamp,
              secret,
            })
          ) {
            throw new APIError("UNAUTHORIZED", {
              status: 401,
              message: "Invalid signature",
            });
          }

          await markNonceUsed(nonce);

          return { context: ctx };
        }),
      },
    ],
  },
});

async function isNonceUsed(nonce: string): Promise<boolean> {
  const exists = await redis.exists(`nonce:${nonce}`);
  return exists === 1;
}

async function markNonceUsed(nonce: string): Promise<void> {
  await redis.set(`nonce:${nonce}`, "1", "PX", NONCE_TTL_MS);
}

function verifyHMAC({
  body,
  signature,
  nonce,
  timestamp,
  secret,
}: {
  body: string;
  signature: string;
  nonce: string;
  timestamp: string;
  secret: string;
}): boolean {
  const input = `${timestamp}:${nonce}:${body}`;
  const expected = crypto
    .createHmac("sha256", secret)
    .update(input)
    .digest("hex");

  try {
    return crypto.timingSafeEqual(
      Buffer.from(expected),
      Buffer.from(signature)
    );
  } catch {
    return false;
  }
}
