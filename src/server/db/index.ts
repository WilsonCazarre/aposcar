import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as aposcarSchema from "./schema/aposcar";
import * as authSchema from "./schema/auth";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

// Merge schemas
const schema = { ...aposcarSchema, ...authSchema };

export const db = drizzle(conn, { schema });
