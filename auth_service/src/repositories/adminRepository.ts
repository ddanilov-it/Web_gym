import { pool } from "../db/db";
import { Admin } from "../entities/admin";



export const createAdmin = async (username: string, password: string): Promise<number> => {
  const result = await pool.query(
    "INSERT INTO admins (username, password) VALUES ($1, $2) RETURNING id",
    [username, password]
  );
  return result.rows[0].id;
};



export const getAdminByUsername = async (username: string): Promise<Admin | null> => {
  const result = await pool.query("SELECT * FROM admins WHERE username = $1", [username]);
  if (result.rows.length === 0) return null;
  const { id, password } = result.rows[0];
  return new Admin(id, username, password);
};