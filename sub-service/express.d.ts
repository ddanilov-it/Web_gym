import { Request } from "express";

// Расширяем интерфейс Request, добавляя свойство user
declare global {
  namespace Express {
    interface Request {
      user?: { email: string }; // Добавляем свойство 'user' с нужной структурой
    }
  }
}