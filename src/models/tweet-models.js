import Joi from "joi";
import { JoiObjectId } from "../consts.js";

const tweetCollectionName = 'tweet'

const tweetSchema = Joi.object({
    content: Joi.string().required(),
    owner: JoiObjectId.objectId().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
})

export {tweetCollectionName}