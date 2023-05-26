import { Router } from 'express';
import { deleteAllDevices, deleteSessionById, getAllDevices } from '../controllers/deviceController';

export const securityRouter = Router();

securityRouter.get('/devices', getAllDevices);

securityRouter.delete('/devices', deleteAllDevices);

securityRouter.delete('/devices/:id', deleteSessionById);
