import {Resolutions} from "../types/videoTypes";
import {ErrorType} from "../types/errorType";

const dataRegex = /^[0-9]{4}-((0[13578]|1[02])-(0[1-9]|[12][0-9]|3[01])|(0[469]|11)-(0[1-9]|[12][0-9]|30)|(02)-(0[1-9]|[12][0-9]))T(0[0-9]|1[0-9]|2[0-3]):(0[0-9]|[1-5][0-9]):(0[0-9]|[1-5][0-9])\.[0-9]{3}Z$/

export const validateAvailableResolution = (resolution: Resolutions[]): boolean => {
    for (let i = 0; i < resolution.length; i++) {
        if (!Object.values(Resolutions).includes(resolution[i])) {
            return true
        }
    }
    return false
}
export const validateBody = ({
                                 title,
                                 author,
                                 availableResolutions,
                                 canBeDownloaded,
                                 minAgeRestriction,
                                 publicationDate
                             }: { title?: string, author?: string, availableResolutions?: Resolutions[] | null, canBeDownloaded?: boolean, minAgeRestriction?: number, publicationDate?: string }): { errorsMessages: ErrorType[] } | undefined => {
    const errorsMessages: ErrorType[] = []
    if (!title || title.length > 40) {
        errorsMessages.push({message: 'Error', field: 'title'})
    }
    if (!author || author.length > 20) {
        errorsMessages.push({message: 'Error', field: 'author'})
    }
    if (!availableResolutions) {
        errorsMessages.push({message: 'Error', field: 'availableResolutions'})
    } else if (validateAvailableResolution(availableResolutions)) {
        errorsMessages.push({message: 'Error', field: 'availableResolutions'})
    }
    if (!(typeof canBeDownloaded === 'undefined')) {
        if (!(typeof canBeDownloaded === 'boolean')) {
            errorsMessages.push({message: 'Error', field: 'canBeDownloaded'})
        }
    }
    if (typeof minAgeRestriction !== "undefined") {
        if (minAgeRestriction < 1 || minAgeRestriction > 18) {
            errorsMessages.push({message: 'Error', field: 'minAgeRestriction'})
        }
    }
    if (publicationDate) {
        if (typeof publicationDate !== "string") {
            errorsMessages.push({message: 'Error', field: 'publicationDate'})

        } else if (!publicationDate?.match(dataRegex)) {
            errorsMessages.push({message: 'Error', field: 'publicationDate'})
        }
    }
    if (errorsMessages.length > 0) {
        return {errorsMessages}
    } else {
        return
    }

}

