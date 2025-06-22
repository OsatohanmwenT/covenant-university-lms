import { defineConfig } from 'drizzle-kit';
import { config } from "dotenv";

config({ path: ".env.local" });

export default defineConfig({
  out: './migrations',
  schema: './src/database/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    password: process.env.DATABASE_PASSWORD!,
    host: process.env.DATABASE_HOST!,
    port: Number(process.env.DATABASE_PORT!),
    user: process.env.DATABASE_USER!,
    database: process.env.DATABASE_NAME!,
    ssl: {
      rejectUnauthorized: false, // or false for dev only
    },
  },
});
