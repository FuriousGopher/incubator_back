import {Request, Response} from 'express'

let blogs= ['test Blog']

export const getAllBlogs = (req: Request, res: Response) => {
    res.status(200).send(blogs)
} //// ready

export const getBlogById = (req: Request, res: Response) => {
} ////// write a fun. get blog by id

export const createNewBlog = (req: Request, res: Response) => {
} //// write fun  create

export const deleteBlogById = (req: Request, res: Response) => {
} ///// write a fun
export const updateBlogById = (req: Request, res: Response) => {

} ///// write a fun
