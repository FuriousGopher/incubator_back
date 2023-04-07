import {VideosType} from "../types/videoTypes";

export let videos: VideosType[] = []

export const videosRepositories = {

    getVideoById(id: number): VideosType | undefined {
        return videos.find(c => c.id === id);
    },

    getAllVideos() {
        return videos.length ? videos : undefined;
    },

    createVideo(video: VideosType) {
        const newVideo = {
            id: +(new Date()),
            title: video.title,
            author: video.author,
            availableResolutions: video.availableResolutions,
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
            publicationDate: new Date(new Date().getTime() + 48 * 60 * 60 * 1000).toISOString(),
        };
        videos.push(newVideo)
        return newVideo
    },

    deleteVideoById(id: number) {
        for (let i = 0; i < videos.length; i++) {
            if (videos[i].id === id) {
                videos.splice(i, 1);
                return true
            }
        }
        return false;
    },


    updateVideoById(id: number, video: VideosType) {
        const videoIndex = videos.findIndex(c => c.id === id);
        if (videoIndex >= 0) {
            videos[videoIndex] = {
                id: id,
                title: video.title,
                author: video.author,
                availableResolutions: video.availableResolutions || [],
                canBeDownloaded: video.canBeDownloaded,
                minAgeRestriction: video.minAgeRestriction,
                createdAt: videos[videoIndex].createdAt,
                publicationDate: video.publicationDate,
            }
            return true
        } else {
            return false
        }

    }


}
