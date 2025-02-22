import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createClient, deleteClient, getAllClients } from "../repositories/clientRepository";

export const addClient = asyncHandler(async (req: Request, res: Response) => {
  const client = await createClient(req.body);
  res.status(201).json(client);
});

export const removeClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteClient(Number(id));
  res.json({ message: "Client removed" });
});

export const getClients = asyncHandler(async (req: Request, res: Response) => {
  const clients = await getAllClients();
  res.json(clients);
});