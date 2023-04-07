import {Request, Response} from 'express'
import {validateBody} from "../validators/videoValidators";
import {videosRepositories} from "../repositories/videos-repositories";


export const getVideoById = (req: Request, res: Response) => {
    let id = +req.params.id;
    const video = videosRepositories.getVideoById(id)
    if (video) {
        res.status(200).send(video);
    } else {
        res.status(404).send('Video not found');
    }
}
export const getAllVideos = (req: Request, res: Response) => {
    const videos = videosRepositories.getAllVideos()
    if (videos) {
        res.status(200).send(videos);
    } else {
        res.status(404).send('Videos not found');
    }
}
export const createVideo = (req: Request, res: Response) => {
    const errors = validateBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    const newVideo = videosRepositories.createVideo(req.body)
    res.status(201).send(newVideo)
}
export const deleteVideoById = (req: Request, res: Response) => {
    const id: number = +req.params.id;
    const isDeleted = videosRepositories.deleteVideoById(id)
    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}
export const updateVideoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    const errors = validateBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    const isUpdated = videosRepositories.updateVideoById(id, req.body)
    if (isUpdated) {
        res.sendStatus(204);
    } else {
        res.status(404).send('Video not found');
    }

}