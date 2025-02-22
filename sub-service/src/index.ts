import express from "express";
import dotenv from "dotenv";
import path from "path";
import swaggerUi from "swagger-ui-express";
import yaml from "yamljs";
import cors from "cors";
import clientRoutes from "./routes/clientRoutes";
import subscriptionRoutes from "./routes/subscriptionRoutes";
import { sequelize } from "./db/db";

// Загружаем переменные окружения
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 5001;

// Загружаем документацию Swagger
const swaggerDocument = yaml.load(path.resolve(__dirname, "../swagger.yaml"));

// Настроим CORS
const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/clients", clientRoutes);
app.use("/subscriptions", subscriptionRoutes);

// Инициализация базы данных перед запуском сервера
sequelize.sync()
  .then(() => {
    app.listen(port, () => console.log(`Server running on port ${port}`));
  })
  .catch((err) => {
    console.error("Failed to initialize database", err);;
  });

