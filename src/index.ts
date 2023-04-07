import express, {Router, Response, Request} from 'express'
import {videosRouter} from "./routes/videos-router";
import {deleteEverything} from "./controllers/videoController";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import bodyParser from 'body-parser'

export const app = express()

const port = 3004

const testRouter = Router()

const jsonBodyMiddleware = express.json()

app.use(bodyParser())

app.use(jsonBodyMiddleware)

app.use('/videos', videosRouter)

app.use('/testing', testRouter)

app.use('/blogs', blogsRouter)

app.use('/posts', postsRouter)

testRouter.delete('/all-data', deleteEverything)


app.use('/', (req: Request, res: Response) => {
    const file = __dirname + '/home.html';
    res.sendFile(file);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



