import { DataTypes, Model } from "sequelize";
import { sequelize } from "../db/db";

export class Subscription extends Model { }

Subscription.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    clientId: { type: DataTypes.INTEGER, allowNull: false },
    status: { type: DataTypes.STRING, allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
  },
  { sequelize, modelName: "subscription" }
);
