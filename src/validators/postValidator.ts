import {ErrorType} from "../types/errorType";


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
    }   ///check?
    if (errorsMessages.length > 0) {
        return {errorsMessages}
    } else {
        return
    }
}



