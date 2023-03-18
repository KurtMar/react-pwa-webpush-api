import { Express } from 'express';
import {post, remove, broadcast, dismiss} from './controllers/subscriptionController';

const initializeRoutes = (app: Express): void => {
  const root = '/api/notifications';
  app.get(`${root}/`, (req, res) => {
    res.send('Hello World!');
  });
  app.post(`${root}/subscribe`, post);
  app.delete(`${root}/unsubscribe`, remove);
  app.post(`${root}/broadcast`, broadcast);
  app.post(`${root}/:id/dismiss`, dismiss);
};

export default initializeRoutes;
