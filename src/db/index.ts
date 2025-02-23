import 'dotenv/config';
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "./schema";

const connectionString =
    process.env.DATABASE_URL ||
    "postgres://postgres:postgres@localhost:5432/postgres";


const client = neon(connectionString);
export const db = drizzle(client, { schema });