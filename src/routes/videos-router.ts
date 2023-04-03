import {Request, Response, Router} from 'express'
export const videosRouter = Router()

const test = [{id: 1, name: "test"}]


videosRouter.get('/', (req: Request, res: Response) => {

    res.send(test)

})
