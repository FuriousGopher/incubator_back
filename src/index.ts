import express, { Response } from 'express'
import {RequestWithBody, RequestWithParams, RequestWithParamsAndBody, RequestWithQuery} from "./types";
import {CourseCreateInputModel} from "./models/CourseCreateModul";
import {CourseUpdateModel} from "./models/CourseUpdateModel";
import {CourseViewModel} from "./models/CourseViewModel";
export const app = express()
const port = 3004

const jsonBodyMiddleware = express.json()
app.use(jsonBodyMiddleware)

type CourseType = {
    id: number;
    title: string;

}

const db: { courses : CourseType[]} = {
    courses: [
        {id: 1, title: 'front-end'},
        {id: 2, title: 'back-end'},
        {id: 3, title: 'auto qa'},
        {id: 4, title: 'devops'}
    ]
}

app.get('/', (req, res) => {

    res.send('Hello World!')

})
app.get('/courses', (req: RequestWithQuery< {title: string}>,
                     res: Response<CourseViewModel[]>) =>{
    let foundCourses =  db.courses;
    if (req.query.title){
        foundCourses = foundCourses.filter(c => c.title.indexOf(req.query.title as string) > -1)
    }
    if (!foundCourses.length){
        res.sendStatus(404)
        return;
    }

    res.send(foundCourses)
})
app.get('/courses/:id', (req: RequestWithParams<{id: string}>,
                         res: Response<CourseViewModel>) =>{
    const foundCourse = db.courses.find(c => c.id === +req.params.id);
    if (!foundCourse){
        res.sendStatus(404)
        return;
    }

    res.send(foundCourse)
})
app.get('/users', (req, res) => {
    res.send(' Samurais!')
})
app.post('/users', (req, res) => {
    res.send('We create Samurais!')
})
app.post('/courses', (req: RequestWithBody<CourseCreateInputModel>, res: Response<CourseType>) => {
    if (!req.body.title){
        res.sendStatus(400)
        return;
    }
    const createdCourse = {
        id: +(new Date()),
        title: req.body.title
    };
    db.courses.push(createdCourse)
    res.json(createdCourse)
})
app.delete('/courses/:id', (req: RequestWithParams<{ id: string }>, res) =>{
    db.courses = db.courses.filter(c => c.id !== +req.params.id);


    res.sendStatus(204)
})
app.put('/courses/:id', (req: RequestWithParamsAndBody<{id: string},CourseUpdateModel>, res)=>{
    if (!req.body.title){
        res.sendStatus(400)
        return
    }
    const  foundCourse = db.courses.find(c=> c.id === +req.params.id)
    if(!foundCourse){
        res.sendStatus(404)
        return;
    }
    foundCourse.title = req.body.title

    res.sendStatus(204)
})
app.delete('/__test__/data', (req, res) =>{
    db.courses = [];
    res.sendStatus(204)
})
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
