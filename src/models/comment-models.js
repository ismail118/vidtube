import Joi from "joi";
import { JoiObjectId } from "../consts.js";

const commentCollectionName = 'comment'

const commentSchema = Joi.object({
    content: Joi.string().required(),
    video: JoiObjectId.objectId().required(),
    owner: JoiObjectId.objectId().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
})

export {commentCollectionName}