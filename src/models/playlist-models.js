import Joi from "joi";
import { JoiObjectId } from "../consts.js";

const playlistCollectionName = 'playlist'

const playlistSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    videos: Joi.array().items(JoiObjectId.objectId()).sparse(),
    owner: JoiObjectId.objectId().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
})

export {playlistCollectionName}