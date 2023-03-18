import { NextFunction, Request, Response } from 'express';
import * as subscriptionRepository from '../repositories/subscriptionRepository';
import webpush, {SendResult, WebPushError} from 'web-push';
import {ISubscription} from "../models/SubscriptionModel";
import {Error} from "mongoose";

export const post = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const subscription: ISubscription = req.body;

    const newSubscription = await subscriptionRepository.create(subscription);

    // Send 201 - resource created
    res.status(201).json(newSubscription);
  } catch (e) {
    next(e);
  }
};

export const remove = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const subscription: ISubscription = req.body;
    if (!subscription?.endpoint) {
      console.log('No endpoint provided');
      res.sendStatus(400);
      return;
    }

    const successful = await subscriptionRepository.deleteByEndpoint(subscription.endpoint);
    if (successful) {
      res.sendStatus(200);
    } else {
      res.sendStatus(500);
    }
  } catch (e) {
    next(e);
  }
};

export const broadcast = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const notification = { title: 'Hey, this is a push notification!', message: 'Nice work!' };

    const subscriptions = await subscriptionRepository.getAll();

    console.log('Broadcasting...')

    const notifications: Promise<SendResult>[] = subscriptions.map((subscription) => {
      console.log('Sending notification to', subscription.endpoint)
      const subscriptionPayload = subscription.toObject<ISubscription>();
      return webpush.sendNotification(subscriptionPayload, JSON.stringify(notification));
    });

    try {
      const results = await Promise.allSettled(notifications);
      results.forEach((result) => {
        if (result.status === 'rejected') {
          const error = result.reason as WebPushError;
          console.log('Error sending notification', error.endpoint, error.body);
        } else {
          console.log('Notification sent', result.value);
        }
      });
      res.sendStatus(200);
    } catch (e: unknown) {
      console.log('Error sending notification', e);
      next(e);
    }
  } catch (e) {
    next(e);
  }
};

export const dismiss = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    console.log('Dismissing notification', req.params.id);
  } catch (e) {
    next(e);
  }
};
