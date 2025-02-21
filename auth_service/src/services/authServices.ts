import jwt from "jsonwebtoken";
import { config } from "../config";

export const generateToken = (id: number) => {
  return jwt.sign({ id }, config.jwtSecret, { expiresIn: "1h" });
};
