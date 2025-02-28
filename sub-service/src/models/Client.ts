import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/db";

export class Client extends Model { }

Client.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    patronymic: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
  },
  { sequelize, modelName: "client" }
);
