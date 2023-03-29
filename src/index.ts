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

const video: { videos : videosType[]} = {
    videos: [
        {id: 1, title: 'front-end', author: 'I'},
        {id: 2, title: 'back-end',author: 'K'},
        {id: 3, title: 'auto qa',author: 'M'},
        {id: 4, title: 'devops',author: 'N'}
    ]
}

app.get('/', (req, res) => {

    res.send('Hi Its I.K Videos')

})
app.get('/videos', (req: Request, res: Response)=> {
    res.send(video.videos)
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
        res.sendStatus(400)
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: ''
    };
    videos.push(newVideo)
    res.status(201).send(newVideo)
});
app.delete('/videos/video:id', (req: Request, res: Response) => {
    const id = +req.params.videoid;
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
        res.send(video)
    } else {
        res.send(404)
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
