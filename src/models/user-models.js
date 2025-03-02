import Joi from "joi"
import { JoiObjectId } from "../consts.js"
import { DB } from "../db/index.js"

const userCollectionName = 'user'

const userIndexSpecs = [
    {
        collectionName: userCollectionName,
        key: { username: 1}, // index 'username' ascending
        options: { unique: true, collation: { locale: 'en', strength: 2 } } // 'username' unqie
    },
    {
        collectionName: userCollectionName,
        key: { email: 1},
        options: { unique: true, collation: { locale: 'en', strength: 2 } }
    }
]

class UserModel {

    userSchema = Joi.object({
        username: Joi.string().required().lowercase().trim(),
        email: Joi.string().required().lowercase().trim(),
        fullName: Joi.string().required().trim(),
        avatar: Joi.string(),
        coverImage: Joi.string(),
        watchHistory: Joi.array().items(JoiObjectId.objectId()).sparse(),
        password: Joi.string().required(),
        refreshToken: Joi.string(),
        createdAt: Joi.date().timestamp(),
        updatedAt: Joi.date().timestamp(),
    })

    insertUser(user) {
        try {        
            const result = DB.collection(userCollectionName).insertOne(user)
            return result
        } catch (err) {
            throw err
        }
    }

    updateUser(user) {
        try {
            DB.collection(userCollectionName).updateOne({ _id: user._id}, {
                $set: {
                    username: user.username,
                    email: user.email,
                    fullName: user.fullName,
                    avatar: user.avatar,
                    coverImage: user.coverImage,
                    watchHistory: user.watchHistory,
                    password: user.password,
                    refreshToken: user.refreshToken,
                    createdAt: user.createdAt,
                    updatedAt: Date.now()
                }
            })
        } catch (err) {
            throw err
        }
    }

    findUser(username, email) {
        try {
            const user = DB.collection(userCollectionName).findOne({
                $or: [{username: username}, {email: email}]
            })
            return user
        } catch (err) {
            throw err
        }
    }

    findUserByID(id) {
        try {        
            const user = DB.collection(userCollectionName).findOne({ _id: id })
            return user
        } catch (err) {
            throw err
        }
    }

    deleteRefreshToken(id) {
        try {
            DB.collection(userCollectionName).updateOne({_id: id}, {
                $set: {
                    refreshToken: "",
                    updatedAt: Date.now()
                }
            })            
        } catch (err) {
            throw err
        }
    }

    getUserProfile(username) {
        try {
            const pipeline = [
                {
                    $match: {username: username}
                },
                {
                    $lookup: {
                        from: "subscription",
                        let: {userId: "$_id"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ "$channel", { $toString: "$$userId" } ]
                                    }
                                }
                            }
                        ],
                        as: "follower"
                    }
                },
                {
                    $lookup: {
                        from: "subscription",
                        let: {userId: "$_id"},
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $eq: [ "$subscriber", { $toString: "$$userId" } ]
                                    }
                                }
                            }
                        ],
                        as: "following"
                    }
                },
                {
                    $addFields: {
                        followerCount: { $size: "$follower"},
                        followingCount: { $size: "$following"}
                    }
                }
            ]

            const profile = DB.collection(userCollectionName).aggregate(pipeline)
            return profile
        } catch (err) {
            throw err
        }
    }

}

export { userCollectionName, userIndexSpecs, UserModel }