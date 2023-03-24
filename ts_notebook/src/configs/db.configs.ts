import * as dotenv from "dotenv";
import { Pool } from "pg";
import logger from "./Logger";

dotenv.config();

const pool = new Pool({
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  host: process.env.DB_HOST!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  user: process.env.DB_USER!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  database: process.env.DB_NAME!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  password: process.env.DB_PASSWORD!,
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  port: parseInt(process.env.DB_PORT!),
});

const connectToDb = async () => {
  try {
    await pool.connect();
    logger.info("Database connected");
  } catch (err) {
    logger.error(err);
  }
};

export { pool as db, connectToDb };
