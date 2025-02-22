import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { initDb } from "./db/db";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import yaml from "yamljs";
import cors from "cors"; // Импортируем cors

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 5000;

// Swagger definition
const swaggerDocument = yaml.load(path.resolve(__dirname, "../swagger.yaml"));

// Настроим CORS
const corsOptions = {
    origin: "*", // Разрешает все источники, можно ограничить по необходимости
    methods: "GET,POST,PUT,DELETE", // Разрешенные методы
    allowedHeaders: "Content-Type,Authorization", // Разрешенные заголовки
};

app.use(cors(corsOptions)); // Подключаем CORS middleware

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use("/api", authRoutes);

initDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
}).catch(err => {
    console.error("Failed to initialize database", err);
});