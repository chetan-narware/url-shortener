import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  REDIS_URL: z.string().optional(),
  PORT: z.string().default("5000"),
  NODE_ENV: z.string().default("development"),
});

export const env = envSchema.parse(process.env);