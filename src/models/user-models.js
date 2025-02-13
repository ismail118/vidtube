import Joi from "joi"
import { JoiObjectId } from "../consts.js"

const userCollectionName = 'user'

const userSchema = Joi.object({
    username: Joi.string().required().lowercase().trim(),
    email: Joi.string().required().lowercase().trim(),
    fullname: Joi.string().required().trim(),
    avatar: Joi.string().required(),
    coverImage: Joi.string().required(),
    watchHistory: Joi.array().items(JoiObjectId.objectId()).sparse(),
    password: Joi.string().required(),
    refreshToken: Joi.string(),
    createdAt: Joi.date().timestamp(),
    updatedAt: Joi.string().timestamp(),
})

const userIndexSpecs = [
    {
        key: { username: 1}, // index 'username' ascending
        options: { unique: true, collation: { locale: 'en', strength: 2 } } // 'username' unqie
    },
    {
        key: { email: 1},
        options: { unique: true, collation: { locale: 'en', strength: 2 } }
    }
]

export { userCollectionName, userIndexSpecs }