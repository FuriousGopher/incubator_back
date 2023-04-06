import {ErrorType} from "../types/errorType";

function isValidUrl(url: string) {
    const regex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
    return regex.test(url);
}

export const validatePostAndPutMethodsForBlogsBody = ({
                                                          id,
                                                          name,
                                                          description,
                                                          websiteUrl
                                                      }: {
    id: string,
    name: string,
    description: string,
    websiteUrl: string
}): {
    errorsMessages: ErrorType[]
} | undefined => {
    const errorsMessages: ErrorType[] = []
    if (!name || name.length > 15) {
        errorsMessages.push({message: 'name max length 15', field: 'name'})
    }
    if (!description || description.length > 500) {
        errorsMessages.push({message: 'description max length 500', field: 'description'})
    }
    if (!websiteUrl || websiteUrl.length > 100) {
        errorsMessages.push({message: 'websiteUrl max length 100', field: 'websiteUrl'});
    } else if (!isValidUrl(websiteUrl)) {
        errorsMessages.push({message: 'Invalid URL', field: 'websiteUrl'});
    }
    if (errorsMessages.length > 0) {
        return {errorsMessages}
    } else {
        return
    }
}



