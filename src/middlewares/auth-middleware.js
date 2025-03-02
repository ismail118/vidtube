import { ApiError } from "../utils/api-error.js";
import { asyncHandler } from "../utils/async-handler.js";
import { decodeToken } from "../utils/jwt-token.js";
import { DB } from "../db/index.js";
import { UserModel } from "../models/user-models.js";

const userModel = new UserModel(DB)

const verifyJWT = asyncHandler( async function (req, resp, next) {
    const token = req.header("Auth").replace("Bearer ", "")

    if (!token) {
        throw new ApiError(401, "Unauthorized")
        return
    }

    const data = decodeToken(token)

    const user = await userModel.findUserByID(data._id)
    user.password = ""
    user.refreshToken = ""

    if (!user) {
        throw new ApiError(401, "Unauthorized")
        return
    }

    req.user = user
    next()

})

export {verifyJWT}