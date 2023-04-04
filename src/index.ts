import express, {Router, Response, Request} from 'express'
import {videosRouter} from "./routes/videos-router";
import {deleteAllVideos} from "./controllers/videoController";
export const app = express()

const port = 3004

const testRouter = Router()

const jsonBodyMiddleware = express.json()

app.use(jsonBodyMiddleware)

app.use('/videos',videosRouter)

app.use('/testing',testRouter)

testRouter.delete('/all-data', deleteAllVideos)

app.use('/', (req: Request, res: Response)=>{
    const file = __dirname + '/home.html';
    res.sendFile(file);
} )

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})



