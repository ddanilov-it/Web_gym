import { Client } from "../models/Client";

export const createClient = async (clientData: any) => {
  return await Client.create(clientData);
};

export const deleteClient = async (id: number) => {
  return await Client.destroy({ where: { id } });
};

export const getAllClients = async () => {
  return await Client.findAll();
};