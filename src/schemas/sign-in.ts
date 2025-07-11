// third-party
import { z } from "zod";

// ==============================|| AUTH SCHEMA - SIGN IN ||============================== //

export const signInSchema = z.object({
  email: z.email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});
