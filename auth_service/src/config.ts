import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Загружаем переменные окружения из файла .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// Чтение ключей из файлов, если они есть
const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH!;
const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH!;

// Проверяем существование файлов ключей
const privateKey = fs.readFileSync(privateKeyPath, "utf8");
const publicKey = fs.readFileSync(publicKeyPath, "utf8");

export const config = {
    port: process.env.PORT || 3000,
    db: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASS,
        port: Number(process.env.DB_PORT) || 5432,
    },
    jwtPrivateKey: privateKey,  // Используем приватный ключ
    jwtPublicKey: publicKey,    // Используем публичный ключ
};
