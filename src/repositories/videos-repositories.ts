import {VideosType} from "../models/videoTypes";
import {videosCollection} from "../models/dbCollections";
import {WithId} from "mongodb";

export let videos: VideosType[] = []

export const videosRepositories = {

    async getVideoById(id: number): Promise<WithId<VideosType> | null> {
        return videosCollection.findOne({id: id}, {projection: {_id: 0}})
    },

    async getAllVideos() {
        return videosCollection.find().project({_id: false}).toArray();
    },

    async createVideo(video: VideosType) {
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
        await videosCollection.insertOne({...newVideo})
        return newVideo
    },

    async deleteVideoById(id: number) {
        const result = await videosCollection.deleteOne({id: id})
        return result.deletedCount === 1
    },

    async updateVideoById(id: number, video: VideosType) {
        const result = await videosCollection.updateOne(
            {id},
            {
                $set: {
                    title: video.title,
                    author: video.author,
                    availableResolutions: video.availableResolutions || [],
                    canBeDownloaded: video.canBeDownloaded,
                    minAgeRestriction: video.minAgeRestriction,
                },
            }
        );
        return result.modifiedCount !== 0;
    },


}
