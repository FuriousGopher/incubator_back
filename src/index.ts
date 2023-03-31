import express, {Request, Response} from 'express'

export const app = express()
const port = 3004

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

enum resolutions {
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
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string | null;
    publicationDate?: string | null;
    availableResolutions?: resolutions[] | null;
}

let videos: videosType[] = []



app.get('/', (req, res) => {

    res.send('Hi Its I.K Videos#2')

})
app.get('/videos', (req: Request, res: Response)=> {
    res.send(videos)
    res.sendStatus(200).send('All Videos')
}) // why not work ?
app.get('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const video = videos.find(c => c.id === id);
    if (video) {
        res.sendStatus(200).send(video);
    } else {
        res.status(404).send('Video not found');
    }
});
app.post('/videos', (req: Request, res: Response) => {
    if (!req.body.title || !req.body.author || !req.body.availableResolutions){
        res.sendStatus(400).send('Need write a title, author and resolution')
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author:  req.body.author,
        availableResolutions: req.body.availableResolutions,
    };
    videos.push(newVideo)
    res.status(201).send(newVideo)
});
app.delete('/testing/all-data', (req: Request, res: Response) =>{
    videos = []
    res.sendStatus(204).send('All data is deleted')
}) // Test pass
app.delete('/videos/:id', (req: Request, res: Response) => {
    const id = +req.params.id;
    const newVideos = videos.filter(video => video.id !== id);
    if (newVideos.length < videos.length) {
        videos = newVideos;
        res.sendStatus(204).send('No Content');
    } else {
        res.sendStatus(404).send('Not Found')
    }
});
app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(c => c.id === id);

    if (videoIndex >= 0) {
        videos[videoIndex] = {
            id: id,
            title: req.body.title,
            author: req.body.author,
            availableResolutions: req.body.availableResolutions || [],
        };
        res.sendStatus(204);
    } else {
        res.status(404).send('Video not found');
    }
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
