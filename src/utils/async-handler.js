const asyncHandler = function (requestHandler) {
    return function (req, resp, next) {
        try {
            requestHandler(req, resp, next)
        } catch (err) {
            next(err)
        }
    }
}

export { asyncHandler }