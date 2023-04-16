export const videoQueryRepositories = {

    getVideos(): VideoOutputModel[] {

        const dbVideos: DBVideo[] = []

        const authors: DBAuthor[] = []

        return dbVideos.map(dbVideo => {
            const author = authors.find(a => a._id === dbVideo.authorId)
            return this._mapDBVideoToVideoOutputModel(dbVideo, author!)
        })
    },
    getVideosById(id: string): VideoOutputModel {
        const dbVideo: DBVideo = {
            _id: ' 2232',
            title: 'sdas',
            authorId: '65156'
        }
        const author: DBAuthor = {
            _id: ' 56354',
            firstName: 'sdas',
            lastName: '65156'
        }
        return this._mapDBVideoToVideoOutputModel(dbVideo, author)
    },
    _mapDBVideoToVideoOutputModel(dbVideo: DBVideo, dbAuthor: DBAuthor) {
        return {
            id: dbVideo._id,
            title: dbVideo.title,
            author: {
                id: dbAuthor!._id,
                name: dbAuthor!.firstName + '' + dbAuthor!.lastName
            }
        }
    }
}

export type DBVideo = {
    _id: string
    title: string
    authorId: string
}

export type DBAuthor = {
    _id: string
    firstName: string
    lastName: string

}

export type VideoOutputModel = {
    id: string
    title: string
    author: {
        id: string
        name: string
    }
}