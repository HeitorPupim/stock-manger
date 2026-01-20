import "dotenv/config";

import { drizzle } from "drizzle-orm/node-postgres";

export const readonlyDb = drizzle(process.env.READONLY_DATABASE_URL!);