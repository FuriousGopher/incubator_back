import { Router } from 'express';
import { deleteAllDevices, deleteSessionById, getAllDevices } from '../controllers/deviceController';
import { deleteDeviceOwnValidator } from '../validators/deleteDeviceOwnValidator';

export const securityRouter = Router();

securityRouter.get('/devices', getAllDevices);

securityRouter.delete('/devices', deleteAllDevices);

securityRouter.delete('/devices/:id', deleteDeviceOwnValidator, deleteSessionById);
