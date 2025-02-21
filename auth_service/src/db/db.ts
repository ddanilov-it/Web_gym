import { Pool } from "pg";
import { config } from "../config";

export const pool = new Pool(config.db);

export const initDb = async () => {
    try {
        await pool.connect();
        console.log("Database connected");

        // Проверка и создание таблицы, если она не существует
        const createTableQuery = `
      CREATE TABLE IF NOT EXISTS admins (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(100) NOT NULL
      );
    `;

        await pool.query(createTableQuery);
        console.log("Admins table created (if it didn't exist)");

    } catch (error) {
        console.error("Database connection failed", error);
        throw error;
    }
};
