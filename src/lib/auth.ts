// third-party
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

// project imports
import { hashPassword, verifyPassword } from "@/utils/argon";
import { db } from "../db/drizzle";
import { schema } from "@/db/schemas/auth-schema";

import { signedRequestPlugin } from "./plugins/signed-request";

// ==============================|| BETTER AUTH INSTANCE ||============================== //

export const auth = betterAuth({
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    password: {
      hash: hashPassword,
      verify: verifyPassword,
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
    usePlural: true,
  }),
  plugins: [signedRequestPlugin(), nextCookies()],
});
