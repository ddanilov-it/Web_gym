import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createSubscription, deleteSubscription, getAllSubscriptions } from "../repositories/subscriptionRepository";
import { subscriptionSchema } from "../validators/subscriptionValidator";

/**
 * Обработчик для ошибок
 */
const handleError = (res: Response, statusCode: number, message: string, details?: any) => {
  res.status(statusCode).json({ error: { code: statusCode, message, details } });
};

export const addSubscription = asyncHandler(async (req: Request, res: Response) => {
  const parsedClientId = Number(req.body.clientId);
  req.body.clientId = parsedClientId;

  const validation = subscriptionSchema.safeParse(req.body);

  if (!validation.success) {
    handleError(res, 400, "Validation failed", validation.error.format());
    return;
  }

  try {
    const subscription = await createSubscription(validation.data);
    res.status(201).json(subscription);
  } catch (error) {
    console.error("Error creating subscription:", error);
    handleError(res, 500, "Internal server error");
  }
});

export const removeSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  if (isNaN(Number(id))) {
    handleError(res, 400, "Invalid subscription ID");
    return;
  }

  try {
    await deleteSubscription(Number(id));
    res.json({ message: "Subscription removed" });
  } catch (error) {
    console.error("Error removing subscription:", error);
    handleError(res, 500, "Internal server error");
  }
});

export const getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  try {
    const subscriptions = await getAllSubscriptions();
    res.json(subscriptions);
  } catch (error) {
    console.error("Error fetching subscriptions:", error);
    handleError(res, 500, "Internal server error");
  }
});
