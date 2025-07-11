// third-party
import { z } from "zod";

// ==============================|| AUTH SCHEMA - SIGN UP ||============================== //

export const signUpSchema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.email().nonempty("Email is required"),
  password: z.string().nonempty("Password is required"),
});
