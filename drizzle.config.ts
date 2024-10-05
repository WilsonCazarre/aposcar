import { type Config } from "drizzle-kit";

import { env } from "@/env";

export default {
  schema: [
    "./src/server/db/schema/aposcar.ts",
    "./src/server/db/schema/auth.ts",
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  tablesFilter: ["aposcar_*"],
} satisfies Config;
