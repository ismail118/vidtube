import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

const healtcheck = asyncHandler(async function (req, resp) {
    return resp
        .status(200)
        .json(new ApiResponse(
            200, 
            "OK", 
            "Health check passed"
        ))
})

export { healtcheck }