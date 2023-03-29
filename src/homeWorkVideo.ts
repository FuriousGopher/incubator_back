import express, { Request, Response} from 'express'


const app = express()

const corsMiddleware = cors();
app.use(corsMiddleware)
const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)

const port = process.env.PORT || 5000

let videos = [
    {id: 1, title: 'videoOne'},
    {id: 2, title: 'videoTwo'},
    {id: 3, title: 'videoThree'},
    {id: 4, title: 'videoFore'}
];

app.get('/', (req: Request, res: Response) =>{
    res.send("Hello Kabar Video")
})
app.get('/videos', (req: Request, res: Response)=>{
    res.send(videos)
})
app.post('/videos', (req: Request, res: Response) =>{
    const newVideo = {
        id: +(new Date()),
        title: req.body.title),
        author: 'IvanK'
    }
    video.push(newVideo)
    res.status(201).send(newVideo)
})
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
app.get('/videos/:videoId', (req: Request, res: Response)=>{
    const id = +req.params.videoId;
    const video = videos.find(c=> c.id === id)
    if(video){
        res.send(video)
    } else {
        res.send(404)
    }
})
app.delete('/videos/videoid', (req: Request, res: Response)=>{
    const id = +req.param.videoid;
    const newVideo = videos.filter(c=> c.id !== id)
    if (newVideo.length< videos.length){
        videos = newVideo
        res.send(204)
    } else {
        res.send(404)
    }

})

app.listen(port, ()=>{
    console.log('Listen port: ${port}')
})