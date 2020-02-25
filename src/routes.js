import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import RecipientController from './app/controllers/RecipientController';
import SessionController from './app/controllers/SessionController';
import DeliverymanController from './app/controllers/DeliverymanController';
import FileController from './app/controllers/FileController';
import DeliveryController from './app/controllers/DeliveryController';
import DeliveryStatusController from './app/controllers/DeliveryStatusController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

const upload = multer(multerConfig);

routes.post('/sessions', SessionController.store);

routes.get(
  '/deliveryman/:deliverymanId/deliveries',
  DeliveryStatusController.index
);

routes.use(authMiddleware);

routes.get('/recipients', RecipientController.index);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:recipientId', RecipientController.update);

routes.post('/deliverymans', DeliverymanController.store);
routes.put('/deliverymans/:deliverymanId', DeliverymanController.update);
routes.delete('/deliverymans/:deliverymanId', DeliverymanController.delete);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliveries', DeliveryController.index);
routes.post('/deliveries', DeliveryController.store);
routes.put('/deliveries/:deliveryId', DeliveryController.update);
routes.delete('/deliveries/:deliveryId', DeliveryController.delete);

export default routes;
