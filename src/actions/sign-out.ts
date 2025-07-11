"use server";

// next
import { cookies } from "next/headers";

// project imports
import { auth } from "@/lib/auth";
import { generateHmacHeaders } from "@/utils/hmac";

// ==============================|| SIGN OUT SERVER ACTION ||============================== //

export async function signOutAction() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get("better-auth.session_token");

  if (!sessionCookie) {
    return {
      success: false,
      message: "Not logged in",
    };
  }

  const body = {};
  const secret = process.env.SIGNED_SECRET!;
  const { signature, timestamp, nonce } = generateHmacHeaders(body, secret);

  const headers = {
    [process.env.HMAC_HEADER_SIGNATURE || "x-signature"]: signature,
    [process.env.HMAC_HEADER_TIMESTAMP || "x-timestamp"]: timestamp,
    [process.env.HMAC_HEADER_NONCE || "x-nonce"]: nonce,
    Cookie: `better-auth.session_token=${sessionCookie.value}`,
  };

  try {
    await auth.api.signOut({ headers });

    return {
      success: true,
      message: "Signed Out Successfully.",
    };
  } catch (error) {
    const e = error as Error;

    return {
      success: false,
      message: e.message || "An Unknown Error Has Occurred.",
    };
  }
}
