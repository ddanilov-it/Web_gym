import express from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes";
import { initDb } from "./db/db";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import yaml from "yamljs";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const port = process.env.PORT || 3000;

// Swagger definition
const swaggerDocument = yaml.load(path.resolve(__dirname, "../swagger.yaml"));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());
app.use("/api", authRoutes);

initDb().then(() => {
    app.listen(port, () => {
        console.log(`Server running on port ${port} 1 `);
    });
}).catch(err => {
    console.error("Failed to initialize database", err);
});
