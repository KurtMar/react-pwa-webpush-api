import Subscription, {ISubscription} from '../models/SubscriptionModel';
import {LeanDocument} from "mongoose";

export const create = async (subscription: ISubscription): Promise<LeanDocument<ISubscription>> => {
  const newSubscription = new Subscription(subscription);
  console.log('newSubscription', newSubscription)
  const hasSubscription = await Subscription.exists({ endpoint: newSubscription.endpoint });
  if (hasSubscription) {
    console.log('subscription already exists');
    return;
  }
  const savedSubscription = await newSubscription.save();
  return savedSubscription.toObject();
};

export const deleteByEndpoint = async (endpoint: string): Promise<boolean> => {
  const result = await Subscription.deleteOne({ endpoint });
  return result.acknowledged && result.deletedCount > 0;
};

export const getAll = async (): Promise<ISubscription[]> => {
  return Subscription.find();
};
