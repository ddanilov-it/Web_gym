import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authService";

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("sljfvhbf", token);

  if (!token) {
    // Убираем return, просто завершаем обработку
    res.status(401).json({ message: "Access denied. No token provided." });
    return; // Завершаем выполнение, дальше код не продолжится
  }

  try {
    console.log(verifyToken(token));

    next();
  } catch {
    res.status(401).json({ message: "Invalid token.!!!!!!!!!!!!!!!!" });
  }

};
