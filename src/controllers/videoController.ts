import {Request, Response} from 'express'
import {videosRepositories} from "../repositories/videos-repositories";
import {HttpStatusCode} from "../types/HTTP-Response";


export const getVideoById = async (req: Request, res: Response) => {
    let id = +req.params.id;
    const video = await videosRepositories.getVideoById(id)
    if (video) {
        res.status(HttpStatusCode.OK).send(video);
    } else {
        res.status(HttpStatusCode.NotFound).send('Video not found');
    }
}
export const getAllVideos = async (req: Request, res: Response) => {
    const videos = await videosRepositories.getAllVideos()
    if (videos) {
        res.status(HttpStatusCode.OK).send(videos);
    } else {
        res.status(HttpStatusCode.NotFound).send('Videos not found');
    }
}
export const createVideo =async (req: Request, res: Response) => {
    const newVideo = await videosRepositories.createVideo(req.body)
    res.status(201).send(newVideo)
}
export const deleteVideoById =async (req: Request, res: Response) => {
    const id: number = +req.params.id;
    const isDeleted = await videosRepositories.deleteVideoById(id)
    if (isDeleted) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
}
export const updateVideoById = async(req: Request, res: Response) => {
    const id = +req.params.id;
    const isUpdated = await videosRepositories.updateVideoById(id, req.body)
    if (isUpdated) {
        res.sendStatus(204);
    } else {
        res.status(404).send('Video not found');
    }

}