import Joi from "joi";
import { JoiObjectId } from "../consts.js";

const likeCollectionName = 'like'

const likeSchema = Joi.object({
    video: JoiObjectId.objectId().required(),
    comment: JoiObjectId.objectId().required(),
    tweet: JoiObjectId.objectId().required(),
    likeBy: JoiObjectId.objectId().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
})

export {likeCollectionName}