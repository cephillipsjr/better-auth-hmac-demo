// third-party
import { createAuthClient } from "better-auth/react";

// ==============================|| BETTER AUTH CLIENT CONFIG ||============================== //

export const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
});
