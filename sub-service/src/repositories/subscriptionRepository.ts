import { Subscription } from "../models/Subscription";

export const createSubscription = async (subscriptionData: any) => {
  return await Subscription.create(subscriptionData);
};

export const deleteSubscription = async (id: number) => {
  return await Subscription.destroy({ where: { id } });
};

export const getAllSubscriptions = async () => {
  return await Subscription.findAll();
};