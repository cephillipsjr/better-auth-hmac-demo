// third-party
import { toNextJsHandler } from "better-auth/next-js";

// project imports
import { auth } from "@/lib/auth";

// ==============================|| BETTER AUTH ROUTE HANDLER ||============================== //

export const { POST, GET } = toNextJsHandler(auth);
