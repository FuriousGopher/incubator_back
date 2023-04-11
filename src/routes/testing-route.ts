import {Router} from 'express'
import {Request, Response} from "express";
import {videos} from "../repositories/videos-repositories";
import {blogs} from "../repositories/blogs-repositories";
import {posts} from "../repositories/posts-repositories";

export const testRouter = Router()


testRouter.delete('/all-data', (req: Request, res: Response) => {
    const deleteEverything = () => {
        videos.length = 0;
        blogs.length = 0;
        posts.length = 0;
    }
    deleteEverything();
    res.status(204).send('All data is deleted');
});