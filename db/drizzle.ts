import { config } from "dotenv"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../migrations/schema"

export const db = drizzle(process.env.DATABASE_URL!, {
  schema,
})
