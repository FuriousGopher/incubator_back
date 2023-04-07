import express, {Router, Response, Request} from 'express'
import {videosRouter} from "./routes/videos-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import bodyParser from 'body-parser'
import {videos} from "./repositories/videos-repositories";
import {blogs} from "./repositories/blogs-repositories";
import {posts} from "./repositories/posts-repositories";

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

testRouter.delete('/all-data', (req: Request, res: Response) => {
    const deleteEverything = () => {
        videos.length = 0;
        blogs.length = 0;
        posts.length = 0;
    }
    deleteEverything();
    res.status(204).send('All data is deleted');
});



app.use('/', (req: Request, res: Response) => {
    const file = __dirname + '/home.html';
    res.sendFile(file);
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



