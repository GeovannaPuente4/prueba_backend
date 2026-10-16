import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schemas.js";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
