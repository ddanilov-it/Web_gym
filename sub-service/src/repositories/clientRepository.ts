import { Client } from "../models/Client";
import { sequelize } from "../db/db";
import { Op } from "sequelize";  

export const createClient = async (clientData: any) => {
  return await Client.create(clientData);
};


export const deleteClient = async (id: number) => {
  return await Client.destroy({ where: { id } });
};

export const getAllClients = async () => {
  return await Client.findAll();
};


export const checkClientExistence = async (email: string, phone: string) => {
  return await Client.findOne({
    where: {
      [Op.or]: [
        { email: email },
        { phone: phone }
      ]
    }
  });
};
