import { DB } from "../db/index.js";
import { UserModel } from "../models/user-models.js";
import { ApiError } from "../utils/api-error.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { generateAccessToken, generateRefreshToken, decodeToken} from "../utils/jwt-token.js";
import { hashPassword, checkPassword } from "../utils/hash-password.js";

const userModel = new UserModel(DB)

const generateAccessAndRefreshToken = async function (userId) {
    try {
        const user = userModel.findUserByID(userId)
    
        if (!user) {
            throw new Error("user not found")
        }
    
        const accessToken = generateAccessToken()
        const refreshToken = generateRefreshToken()
    
        user.refreshToken = refreshToken
        await userModel.updateUser(user)
        return {accessToken, refreshToken}
    } catch (err) {
        throw err
    }
}

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
            username: body.username.toLowerCase(),
            email: body.email,
            fullName: body.fullName,
            avatar: avatar.url,
            coverImage: coverImg.url,
            watchHistory: [],
            password: hashPassword(body.password),
            refreshToken: "",
            createdAt: Date.now(),
            updatedAt: Date.now()
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

const loginUser = asyncHandler( async function (req, resp, next) {
    const email = req.body.email
    const passowrd = req.body.passowrd

    try {
        if (!email) {
            return next(new ApiError(400, "email is required"))
        }
        if (!passowrd) {
            return next(new ApiError(400, "password is required"))
        }
    
        const user = userModel.findUser("", email)
    
        if (!user) {
            return next(new ApiError(404, "user not found"))
        }
    
        if (!checkPassword(passowrd, user.passowrd)) {
            return next(new ApiError(400, "incorrect password"))
        }
    
        const tokens = await generateAccessAndRefreshToken(user._id)

        const options = {
            httpOnly: true,
            secure: process.env.NODE_ENV == "production"
        }

        user.passowrd = ""
        user.refreshToken = ""

        return resp
            .status(200)
            .cookie("accessToken", tokens.accessToken, options)
            .cookie("refreshToken", tokens.refreshToken, options)
            .json(new ApiResponse(200, user, "login success"))
    } catch (err) {
        return next(new ApiError(500, "something went wrong"))
    }
})

const refreshAccessToken = asyncHandler( async function (req, resp, next) {
    const incomingRefreshToken = req.cookie.refreshToken

    if (!incomingRefreshToken) {
        return next(new ApiError(401, "Refresh token required"))
    }

    const data = decodeToken(incomingRefreshToken)

    const user = userModel.findUserByID(data._id)
    if (!user) {
       return next(new ApiError(401, "Invalid refresh token"))
    }

    if (incomingRefreshToken != user.refreshToken) {
        return next(new ApiError(401, "Invalid refresh token"))
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production"
    }

    const tokens = await generateAccessAndRefreshToken(user._id)

    user.passowrd = ""
    user.refreshToken = ""

    return resp
        .status(200)
        .cookie("accessToken", tokens.accessToken, options)
        .cookie("refreshToken", tokens.refreshToken, options)
        .json(new ApiResponse(200, {}, "success refresh token"))
})

const logout = asyncHandler(async function (req, resp, next) {
    try {
        userModel.deleteRefreshToken(req.user._id)
    } catch (error) {
        
    }

    const options = {
        httpOnly: true,
        secure: process.env.NODE_ENV == "production"
    }

    return resp
        .status(200)
        .clearCookie("accessToken", tokens.accessToken, options)
        .clearCookie("refreshToken", tokens.refreshToken, options)
        .json(new ApiResponse(200, {}, "Success logout"))
})

const changePassword = asyncHandler(async function (req, resp, next) {
    const oldPassword = req.body.olePassword
    const newPassword = req.body.newPassword

    const user = userModel.findUserByID(req.user._id)

    isCorrectPassword = checkPassword(oldPassword, user.password)
    if (!isCorrectPassword) {
        return next(new ApiError(401, "Inccorect password"))
    }

    user.passowrd = newPassword

    userModel.updateUser(user)

    return resp.status(200)
        .json(new ApiResponse(200, {}, "success change password"))
})

const updateUserAvatar = asyncHandler(async function (req, resp, next) {
    const user = userModel.findUserByID(req.user._id)

    const avatarPath = req.files.path
    if (!avatarPath) {
        return next(ApiError(400, "avatar required"))
    }
    const avatar = await uploadOnCloudinary(avatarPath)

    user.avatar = avatar.url

    userModel.updateUser(user)
    
    resp.status(200)
        .json(new ApiResponse(200, {}, "Avatar has been change"))
})

const updateUserCoverImage = asyncHandler(async function (req, resp, next) {
    const user = userModel.findUserByID(req.user._id)

    const coverImagePath = req.files.path
    if (!coverImagePath) {
        return next(ApiError(400, "Cover image required"))
    }
    const coverImg = await uploadOnCloudinary(coverImagePath)

    user.coverImage = coverImg.url

    userModel.updateUser(user)
    
    resp.status(200)
        .json(new ApiResponse(200, {}, "Cover image has been change"))
})

const getUserChannelProfile = asyncHandler(async function (req, resp, next) {
    const username = req.username

    if (!username) {
        return next(new ApiError(400, "username required"))
    }

    const profile = await userModel.getUserProfile(username)

    if (!profile) {
        return next(new ApiError(404, "profile not found"))
    }

    return resp.status(200)
        .json(new ApiResponse(200, profile, "success get profile"))
})

const getWatchHistory = asyncHandler(async function (req, resp, next) {
    // TODO
})
export { registerUser, loginUser, logout, refreshAccessToken, changePassword, updateUserAvatar, updateUserCoverImage, getUserChannelProfile }