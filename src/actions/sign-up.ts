"use server";

// project imports
import { auth } from "@/lib/auth";
import { generateHmacHeaders } from "@/utils/hmac";

// ==============================|| SIGN UP SERVER ACTION ||============================== //

export async function signUpAction(
  name: string,
  email: string,
  password: string
) {
  const body = { name, email, password };
  const secret = process.env.SIGNED_SECRET!;
  const { signature, timestamp, nonce } = generateHmacHeaders(body, secret);

  const headers = {
    [process.env.HMAC_HEADER_SIGNATURE || "x-signature"]: signature,
    [process.env.HMAC_HEADER_TIMESTAMP || "x-timestamp"]: timestamp,
    [process.env.HMAC_HEADER_NONCE || "x-nonce"]: nonce,
  };

  try {
    await auth.api.signUpEmail({
      body,
      headers,
    });

    return {
      success: true,
      message: "Signed Up Successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An Unknown Error Has Occurred.",
    };
  }
}
