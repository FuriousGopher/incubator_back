import {Router} from 'express'
import {
    createVideo,
    deleteVideoById,
    getAllVideos,
    getVideoById, updateVideoById
} from "../controllers/videoController";
export const videosRouter = Router()

videosRouter.get('/', getAllVideos)
videosRouter.get('/:id', getVideoById);
videosRouter.post('/', createVideo);
videosRouter.delete('/:id',deleteVideoById );
videosRouter.put('/:id', updateVideoById );