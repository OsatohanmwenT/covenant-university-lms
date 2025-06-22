import { drizzle } from 'drizzle-orm/tidb-serverless';
import { config } from "dotenv"
import { connect } from '@tidbcloud/serverless';
import * as schema from "./schema"

config({ path: ".env.local" });

const client = connect({ url: process.env.DATABASE_URL! });
export const db = drizzle({ client: client, schema });
