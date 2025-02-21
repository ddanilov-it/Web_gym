import { pool } from "../db/db";
import { Admin } from "../entities/admin";

export const createAdmin = async (username: string, password: string, firstName: string, lastName: string, email: string): Promise<number> => {
  const result = await pool.query(
    "INSERT INTO admins (username, password, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [username, password, firstName, lastName, email]
  );
  return result.rows[0].id;
};

export const getAdminByEmail = async (email: string): Promise<Admin | null> => {
  const result = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
  if (result.rows.length === 0) return null;
  const { id, username, password, first_name, last_name } = result.rows[0];
  return new Admin(id, username, password, first_name, last_name, email);
};


export const getAllAdmins = async (): Promise<Admin[]> => {
  const result = await pool.query("SELECT * FROM admins");
  return result.rows.map(row => new Admin(row.id, row.username, row.password, row.first_name, row.last_name, row.email));
};