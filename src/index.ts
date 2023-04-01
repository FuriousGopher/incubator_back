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

type errorType = {
    message: string
    field: string
}

let videos: videosType[] = []
const validateBody = ({title,author,availableResolutions, canBeDownloaded}: {title?: string, author?: string, availableResolutions?: resolutions[] , canBeDownloaded?: boolean }): {errorMessages: errorType[]} | undefined =>  {
    const errorMessages: errorType[] = []
    if (!title || title.length > 40){
        errorMessages.push({message: 'Error', field: 'title'} )
    }
    if (!author || author.length > 20){
        errorMessages.push({message: 'Error', field: 'author'} )
    }
    if (!availableResolutions){
        errorMessages.push({message: 'Error', field: 'availableResolutions'} )
    }
    if (Boolean(canBeDownloaded)){
        errorMessages.push({message: 'Error', field: 'canBeDownloaded'} )
    }
    if (errorMessages.length > 0 ){
        return {errorMessages}
    } else { return }

}

app.get('/', (req, res) => {

    res.send('Hi Its I.K Videos#2')

})
app.get('/videos', (req: Request, res: Response)=> {
    res.status(200).send(videos)
}) // why not work?
app.get('/videos/:id', (req: Request, res: Response) =>  {
    let id = +req.params.id;
    let video = videos.find(c => c.id === id);
    if (video) {
        res.status(200).send(video);
    } else {
        res.status(404).send('Video not found');
    }
});
app.post('/videos', (req: Request, res: Response) => {
    const errors = validateBody(req.body)
    if (errors?.errorMessages){
        res.status(400).send(errors)
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author:  req.body.author,
        availableResolutions: req.body.availableResolutions,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
    };
    videos.push(newVideo)
    res.status(201).send(newVideo)
}); // why date difference ?
app.delete('/testing/all-data', (req: Request, res: Response) =>{
    videos = []
    res.sendStatus(204).send('All data is deleted')
}) // Test pass
app.delete('/videos/:id', (req: Request, res: Response) => {
   for (let i = 0; i<videos.length; i++){
       if (videos[i].id === +req.params.id) {
           videos.splice(i, 1);
           res.send(204);
           return;
       }
   }
   res.send(404)
}); // Test pass
app.put('/videos/:id', (req, res) => {
    const id = +req.params.id;
    const videoIndex = videos.findIndex(c => c.id === id);
    const errors = validateBody(req.body)
    if (errors?.errorMessages){
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
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
