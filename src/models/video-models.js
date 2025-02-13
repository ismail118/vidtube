import Joi from 'joi'
import { JoiObjectId } from '../consts.js'

const videoColletionName = "video"

const videoSchema = Joi.object({
    videoFile: Joi.string().required(),
    thubnail: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    duration: Joi.number().required(),
    views: Joi.number().default(0),
    isPublished: Joi.boolean().default(true),
    owner: JoiObjectId.objectId().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.string().timestamp(),
})

export { videoColletionName }