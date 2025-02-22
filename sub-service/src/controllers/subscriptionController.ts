import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { createSubscription, deleteSubscription, getAllSubscriptions } from "../repositories/subscriptionRepository";

export const addSubscription = asyncHandler(async (req: Request, res: Response) => {
  const subscription = await createSubscription(req.body);
  res.status(201).json(subscription);
});

export const removeSubscription = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await deleteSubscription(Number(id));
  res.json({ message: "Subscription removed" });
});

export const getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
  const subscriptions = await getAllSubscriptions();
  res.json(subscriptions);
});
