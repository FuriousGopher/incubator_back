import express, {Response, Request} from 'express'
import {videosRouter} from "./routes/videos-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import bodyParser from 'body-parser'
import {testRouter} from "./routes/testing-route";
import {runDb} from "./repositories/db";

export const app = express()

const port = process.env.PORT || 3004


const jsonBodyMiddleware = express.json()

app.use(bodyParser())

app.use(jsonBodyMiddleware)

app.use('/videos', videosRouter)

app.use('/testing', testRouter)

app.use('/blogs', blogsRouter)

app.use('/posts', postsRouter)

app.use('/', (req: Request, res: Response) => {
    const file = __dirname + '/home.html';
    res.sendFile(file);
})


const startApp = async () => {
    await runDb()
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

startApp()



