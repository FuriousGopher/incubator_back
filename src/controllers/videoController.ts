import {Request, Response} from 'express'

import {VideosType} from "../types/videoTypes";
import {validateBody} from "../validators/videoValidators";

 let videos: VideosType[] = []

export const getVideoById = (req: Request, res: Response) => {
    let id = +req.params.id;
    let video = videos.find(c => c.id === id);
    if (video) {
        res.status(200).send(video);
    } else {
        res.status(404).send('Video not found');
    }
}
export const getAllVideos = (req: Request, res: Response) => {
    res.status(200).send(videos)
}
export const createVideo = (req: Request, res: Response) => {
    const errors = validateBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
        publicationDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString(),
    };
    videos.push(newVideo)
    res.status(201).send(newVideo)
}
export const deleteAllVideos = (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204).send('All data is deleted')
}
export const deleteVideoById = (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.sendStatus(204);
            return;
        }
    }
    res.sendStatus(404)
}
export const updateVideoById = (req: Request, res: Response) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(c => c.id === id);
    const errors = validateBody(req.body)
    if (errors?.errorsMessages) {
        res.status(400).send(errors)
        return;
    }
    if (videoIndex >= 0) {
        videos[videoIndex] = {
            id: id,
            title: req.body.title,
            author: req.body.author,
            availableResolutions: req.body.availableResolutions || [],
            canBeDownloaded: req.body.canBeDownloaded,
            minAgeRestriction: req.body.minAgeRestriction,
            createdAt: videos[videoIndex].createdAt,
            publicationDate: req.body.publicationDate,
        };
        res.sendStatus(204);
    } else {
        res.status(404).send('Video not found');
    }
}