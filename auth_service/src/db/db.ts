import { Sequelize } from "sequelize";
import { config } from "../config";

export const sequelize = new Sequelize(
  config.db.database!,
  config.db.user!,
  config.db.password!,
  {
    dialect: "postgres",
    host: config.db.host,
    port: config.db.port,


    logging: false,
  }
);

export const initDb = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected");
    await sequelize.sync({ alter: true });
    console.log("All models synchronized");
  } catch (error) {
    console.error("Database connection failed", error);
    throw error;
  }
};
