import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/authServices";
import { getAdminByEmail } from "../repositories/adminRepository"; // Обновленный импорт

export const authenticateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    // Убираем return, просто завершаем обработку
    res.status(401).json({ message: "Access denied. No token provided." });
    return; // Завершаем выполнение, дальше код не продолжится
  }

  try {
    const decoded = verifyToken(token) as { email: string };

    if (!decoded.email) {
      res.status(401).json({ message: "Invalid token structure." });
      return;
    }

    // Проверяем, существует ли пользователь по email, полученному из токена
    const admin = await getAdminByEmail(decoded.email);

    if (!admin) {
      res.status(401).json({ message: "User not found." });
      return;
    }

    // Прикрепляем пользователя к объекту запроса
    req.user = { email: decoded.email };
    next();  // Переход к следующему middleware
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
  }
};
