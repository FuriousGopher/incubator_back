import express, { Request, Response } from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";

export const app = express()
const port = 3004

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

enum Resolutions {
    P144 = '144p',
    P240 = '240p',
    P360 = '360p',
    P480 = '480p',
    P720 = '720p',
    P1080 = '1080p',
    P1440 = '1440p',
    P2160 = '2160p',
}

type videosType = {
    id: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string | null;
    publicationDate?: string | null;
    availableResolutions?: Resolutions[] | null;
}

let videos: videosType[] = []



app.get('/', (req, res) => {

    res.send('Hi Its I.K Videos')

})
app.get('/videos', (req: Request, res: Response)=> {
    res.send(videos)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const video = videos.find(c => c.id === id);
    if (video) {
        res.send(video);
    } else {
        res.status(404).send('Video not found');
    }
});
app.post('/videos', (req: Request, res: Response) => {
    if (!req.body.title){
        res.sendStatus(400).send('Need write a title')
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author:  req.body.author,
    };
    videos.push(newVideo)
    res.status(201).send(newVideo)
});
app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId;
    const newVideos = videos.filter(video => video.id !== id);
    if (newVideos.length < videos.length) {
        videos = newVideos;
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});
app.put('/videos/:videoId', (req: Request, res: Response)=>{
    const id = +req.params.videoId;
    const video = videos.find(c=> c.id === id)
    if(video) {
        video.title = req.body.title;
        res.status(204).send(video)
    } else {
        res.sendStatus(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
