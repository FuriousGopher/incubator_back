import {ErrorType} from "../types/errorType";
import {BlogsType} from "../types/blogsType";
import {blogs} from "../repositories/blogs-repositories";

function blogExists(blogId: string, blogs: BlogsType[]): boolean {
    return blogs.some(blog => blog.id === blogId);
}
export const validatePostAndPutMethodsForPostsBody = ({
                                 title,
                                 shortDescription,
                                 content,
                                 blogId
                             }: { title: string, shortDescription: string, content: string, blogId: string }): { errorsMessages: ErrorType[] } | undefined => {
    const errorsMessages: ErrorType[] = []
    if (!title || title.length > 30) {
        errorsMessages.push({message: 'title max length 30', field: 'title'})
    }
    if (!shortDescription || shortDescription.length > 100) {
        errorsMessages.push({message: 'shortDescription max length 100', field: 'shortDescription'})
    }
    if (!content || content.length > 1000) {
        errorsMessages.push({message: 'content max length 1000', field: 'content'})
    }
    if (!blogId ) {
        errorsMessages.push({message: 'blogId must be included', field: 'blogId'})
    } else if (!blogExists(blogId, blogs)) {
        errorsMessages.push({ message: 'blogId doesnt match', field: 'blogId' });
    }
    if (errorsMessages.length > 0) {
        return {errorsMessages}
    } else {
        return
    }
}



