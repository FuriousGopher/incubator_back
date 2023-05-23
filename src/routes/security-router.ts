import { Router } from 'express';
import { deleteSessionById, getAllDevices } from '../controllers/deviceController';

export const securityRouter = Router();

securityRouter.get('/devices', getAllDevices);

securityRouter.delete('/devices');

securityRouter.delete('/devices/:id', deleteSessionById);
