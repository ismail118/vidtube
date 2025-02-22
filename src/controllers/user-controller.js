import { DB } from "../db/index.js";
import { UserModel } from "../models/user-models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { hashPassword } from "../utils/hash-password.js";

const userModel = new UserModel(DB)

const registerUser = asyncHandler( async function (req, resp, next) {
    const body = req.body

    const result = userModel.userSchema.validate(body)
    if (result.error) {
        return next(new ApiError(400, "validate error", [result.error]))
    }

    const avatarPath = req.files?.avatar[0]?.path
    if (!avatarPath) {
        return next(ApiError(400, "avatar required"))
    }
    const avatar = await uploadOnCloudinary(avatarPath)
    
    const coverPath = req.files?.coverImage[0]?.path
    if (!coverPath) {
        return next(ApiError(400, "cover image required"))
    }
    const coverImg = await uploadOnCloudinary(coverPath)

    const user = await userModel.findUser(body.username, body.email)
    if (user == null) {
        const result = await userModel.insertUser({
            fullName: body.fullName,
            avatar: avatar.url,
            coverImage: coverImg.url,
            email: body.email,
            username: body.username.toLowerCase(),
            password: hashPassword(body.password)
        })
        
        const createdUser = await userModel.findUserByID(result.insertedId)

        if (!createdUser) {
            await deleteFromCloudinary(avatar.public_id)
            await deleteFromCloudinary(coverImg.public_id)
            return next(ApiError(500, "something wrong created user"))
        }
        createdUser.password = ""
        createdUser.refreshToken = ""

        resp.status(200)
        .json(new ApiResponse(200, createdUser, "success created user"))
    } else {
        return next(new ApiError(400, "user already exists"))
    }
})

export { registerUser }