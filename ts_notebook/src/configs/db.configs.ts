import * as dotenv from "dotenv";
import { Pool } from "pg";
import logger from "./Logger";

dotenv.config();

const pool = new Pool({
    host: process.env.DB_HOST!,
    user: process.env.DB_USER!,
    database: process.env.DB_NAME!,
    password: process.env.DB_PASSWORD!,
    port: parseInt(process.env.DB_PORT!)
});

const connectToDb = async () => {
    try {
        await pool.connect();
    } catch (err) {
        logger.error(err);
    }
}

connectToDb();

export {pool as db};