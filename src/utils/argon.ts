// third-party
import { hash, verify, type Options } from "argon2";

// types
const options: Options = {
  memoryCost: 19456,
  timeCost: 2,
  hashLength: 32,
  parallelism: 1,
};

// ==============================|| ARGON2 PASSWORD HASHING ||============================== //

export async function hashPassword(password: string): Promise<string> {
  const result = await hash(password, options);
  return result;
}

export async function verifyPassword(data: {
  password: string;
  hash: string;
}): Promise<boolean> {
  const { password, hash } = data;

  const result = await verify(hash, password, options);
  return result;
}
