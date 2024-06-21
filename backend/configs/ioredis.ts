import { parsedProcessEnv } from "@/validation/env-vars-validator.js";
import { Redis } from "ioredis";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
  password: parsedProcessEnv.REDIS_PASSWORD,
});

export { redisClient };
