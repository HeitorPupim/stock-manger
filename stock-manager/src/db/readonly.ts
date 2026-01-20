import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

const readonlyDatabaseUrl = process.env.READONLY_DATABASE_URL;
if (!readonlyDatabaseUrl) {
  throw new Error("READONLY_DATABASE_URL is not set.");
}

export const readonlyDb = drizzle(readonlyDatabaseUrl);
