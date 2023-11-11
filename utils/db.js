import * as pg from "pg";
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL
const { Pool } = pg.default;
const db = new Pool({
    connectionString,
});

export { db };