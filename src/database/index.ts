import { drizzle } from "drizzle-orm/tidb-serverless";
import { connect } from "@tidbcloud/serverless";
import { config } from "dotenv";
import * as schema from "./schema";

config({ path: ".env.local" });

// Connect using the TiDB Cloud Serverless client
const client = connect({ url: process.env.DATABASE_URL! });

// ✅ Pass the `client` directly to drizzle (no object wrapping)
export const db = drizzle(client, { schema });
