import envVars from "@/configs/env-config";
import { Redis } from "ioredis";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
  password: envVars.REDIS_PASSWORD,
});

export default redisClient;
