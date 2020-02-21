import { Router } from 'express';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);

routes.get('/deliverymans', DeliverymanController.index);
routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:deliverymanId', DeliverymanController.update);
routes.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);

export default routes;
