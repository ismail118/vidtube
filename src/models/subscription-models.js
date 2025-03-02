import Joi from "joi";
import { JoiObjectId } from "../consts.js";
import { DB } from "../db/index.js"

const subscriptionCollectionName = 'subscription'

class SubscriptionModel {
    subscriptionSchema = Joi.object({
        subscriber: JoiObjectId.objectId().required(),
        channel: JoiObjectId.objectId().required(),
        createdAt: Joi.date().timestamp(),
        updatedAt: Joi.date().timestamp(),
    })

}

export {subscriptionCollectionName}