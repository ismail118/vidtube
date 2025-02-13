import Joi from "joi";
import { JoiObjectId } from "../consts.js";

const subscriptionCollectionName = 'subscription'

const subscriptionSchema = Joi.object({
    subscriber: JoiObjectId.objectId().required(),
    channel: JoiObjectId.objectId().required(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.date().timestamp(),
})

export {subscriptionCollectionName}