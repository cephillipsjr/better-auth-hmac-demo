// third-party
import Redis from "ioredis";

// ==============================|| REDIS CONFIG ||============================== //
export const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT || "6379", 10),
  password: process.env.REDIS_PASSWORD,
  db: 0,
});
