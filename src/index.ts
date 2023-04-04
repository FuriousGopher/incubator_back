import express, {Request, Response} from 'express'
import {videosRouter} from "./routes/videos-router";

export const app = express()
const port = 3004

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

app.use('/test', videosRouter )

enum Resolutions {
    P144 = 'P144',
    P240 = 'P240',
    P360 = 'P360',
    P480 = 'P480',
    P720 = 'P720',
    P1080 = 'P1080',
    P1440 = 'P1440',
    P2160 = 'P2160',
}

type videosType = {
    id?: number;
    title: string;
    author: string;
    canBeDownloaded?: boolean;
    minAgeRestriction?: number | null;
    createdAt?: string | null;
    publicationDate?: string | null;
    availableResolutions?: Resolutions[] | null;
}

const dataRegex = /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/

const validateAvailableResolution = (resolution: Resolutions[]): boolean => {
    for (let i = 0; i < resolution.length; i++) {
        if (!Object.values(Resolutions).includes(resolution[i])) {
            return true
        }
    }
    return false
}

type errorType = {
    message: string
    field: string
}

let videos: videosType[] = []
const validateBody = ({
                          title,
                          author,
                          availableResolutions,
                          canBeDownloaded,
                          minAgeRestriction,
                          publicationDate
                      }: { title?: string, author?: string, availableResolutions?: Resolutions[] | null, canBeDownloaded?: boolean, minAgeRestriction?: number, publicationDate?: string }): { errorsMessages: errorType[] } | undefined => {
    const errorsMessages: errorType[] = []
    if (!title || title.length > 40) {
        errorsMessages.push({message: 'Error', field: 'title'})
    }
    if (!author || author.length > 20) {
        errorsMessages.push({message: 'Error', field: 'author'})
    }
    if (!availableResolutions) {
        errorsMessages.push({message: 'Error', field: 'availableResolutions'})
    } else if (validateAvailableResolution(availableResolutions)) {
        errorsMessages.push({message: 'Error', field: 'availableResolutions'})
    }
    if (!(typeof canBeDownloaded === 'undefined')) {
        if (!(typeof canBeDownloaded === 'boolean')) {
            errorsMessages.push({message: 'Error', field: 'canBeDownloaded'})
        }
    }
    if (typeof minAgeRestriction !== "undefined") {
        if(minAgeRestriction < 1 || minAgeRestriction > 18){
            errorsMessages.push({message: 'Error', field: 'minAgeRestriction'})
        }
    }
    if (publicationDate) {
        if (typeof publicationDate !== "string") {
            errorsMessages.push({message: 'Error', field: 'publicationDate'})

        } else if (!publicationDate?.match(dataRegex)) {
            errorsMessages.push({message: 'Error', field: 'publicationDate'})
        }
    }
    if (errorsMessages.length > 0) {
        return {errorsMessages}
    } else {
        return
    }

}

app.get('/', (req, res) => {

    res.send('Hi Its I.K Videos#2')

})
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})
app.get('/videos/:id', (req: Request, res: Response) => {
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
});
app.delete('/testing/all-data', (req: Request, res: Response) => {
    videos = []
    res.sendStatus(204).send('All data is deleted')
})
app.delete('/videos/:id', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1);
            res.send(204);
            return;
        }
    }
    res.send(404)
});
app.put('/videos/:id', (req, res) => {
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
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



