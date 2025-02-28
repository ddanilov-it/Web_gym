import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createClient, deleteClient, getAllClients, checkClientExistence } from "../repositories/clientRepository";
import { clientSchema } from "../validators/clientValidator";

/**
 * Обработчик для ошибок
 */
const handleError = (res: Response, statusCode: number, message: string, details?: any) => {
  res.status(statusCode).json({ error: { code: statusCode, message, details } });
};

export const addClient = asyncHandler(async (req: Request, res: Response) => {
  const validation = clientSchema.safeParse(req.body);

  if (!validation.success) {
    handleError(res, 400, "Validation failed", validation.error.format());
    return;
  }

  const { email, phone } = validation.data;

  // Check if a client with the same email or phone already exists using the repository function
  const existingClient = await checkClientExistence(email, phone);

  if (existingClient) {
    handleError(res, 400, "Client with the same email or phone already exists");
    return;
  }

  try {
    const client = await createClient(validation.data);
    res.status(201).json(client);
  } catch (error) {
    console.error("Error creating client:", error);
    handleError(res, 500, "Internal server error");
  }
});

export const removeClient = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    handleError(res, 400, "Invalid client ID");
    return;
  }

  try {
    await deleteClient(Number(id));
    res.json({ message: "Client removed" });
  } catch (error) {
    console.error("Error removing client:", error);
    handleError(res, 500, "Internal server error");
  }
});

export const getClients = asyncHandler(async (req: Request, res: Response) => {
  try {
    const clients = await getAllClients();
    res.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    handleError(res, 500, "Internal server error");
  }
});
