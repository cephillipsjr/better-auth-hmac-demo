"use server";

// project imports
import { auth } from "@/lib/auth";
import { generateHmacHeaders } from "@/utils/hmac";

// ==============================|| SIGN IN SERVER ACTION ||============================== //

export async function signInAction(email: string, password: string) {
  const body = { email, password };
  const secret = process.env.SIGNED_SECRET!;
  const { signature, timestamp, nonce } = generateHmacHeaders(body, secret);

  const headers = {
    [process.env.HMAC_HEADER_SIGNATURE || "x-signature"]: signature,
    [process.env.HMAC_HEADER_TIMESTAMP || "x-timestamp"]: timestamp,
    [process.env.HMAC_HEADER_NONCE || "x-nonce"]: nonce,
  };

  try {
    await auth.api.signInEmail({
      headers,
      body,
    });

    return {
      success: true,
      message: "Signed In Successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An Unknown Error Has Occurred.",
    };
  }
}
