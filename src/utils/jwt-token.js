import jwt from 'jsonwebtoken'

const generateAccessToken = function (payload) {
    return jwt.sign({
        _id: payload._id,
        email: payload.email,
        username: payload.username,
        fullname: payload.fullname
    }, process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXP})
}

const generateRefreshToken = function (payload) {
    return jwt.sign({
        _id: payload._id,
    }, process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXP})
}

const decodeToken = function (token) {
    const data = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    return data
}

export {generateAccessToken, generateRefreshToken, decodeToken}