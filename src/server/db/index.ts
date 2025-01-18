import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/env";
import * as aposcarSchema from "./schema/aposcar";
import * as authSchema from "./schema/auth";
import { type Logger } from "drizzle-orm";
import { format } from "sql-formatter";
import { highlight } from "sql-highlight";

const globalForDb = globalThis as unknown as {
  conn: postgres.Sql | undefined;
};

const conn = globalForDb.conn ?? postgres(env.DATABASE_URL);
if (env.NODE_ENV !== "production") globalForDb.conn = conn;

class TableLogger implements Logger {
  logQuery(query: string, params: unknown[]): void {
    console.log("Query:");
    console.log(highlight(format(query, { language: "postgresql" })));

    if (params.length > 0) {
      console.log("Parameters:");
      console.table(params);
    }
  }
}

// Merge schemas
const schema = { ...aposcarSchema, ...authSchema };

export const db = drizzle(conn, { schema, logger: new TableLogger() });
