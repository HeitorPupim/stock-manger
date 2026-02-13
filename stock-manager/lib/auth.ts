import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/src/db"; // your drizzle instance
import * as schema from "@/src/db/schema";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: schema,
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        input: false,
        defaultValue: "USER",
      },
    },
  },
  emailAndPassword: {
    enabled: true,
  },
  // Social providers field: (Google)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      enabled: true,
    },
  },
});
