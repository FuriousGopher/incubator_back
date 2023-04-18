import { Router } from 'express';
import { createVideo, deleteVideoById, getAllVideos, getVideoById, updateVideoById } from '../controllers/videoController';
import { validatorVideoBody } from '../validators/videoValidators';
import { validationMiddleware } from '../middlewares/ValidationErorrsMiddleware';

export const videosRouter = Router();

videosRouter.get('/', getAllVideos);
videosRouter.get('/:id', getVideoById);
videosRouter.post('/', validatorVideoBody, validationMiddleware, createVideo);
videosRouter.delete('/:id', deleteVideoById);
videosRouter.put('/:id', validatorVideoBody, validationMiddleware, updateVideoById);
