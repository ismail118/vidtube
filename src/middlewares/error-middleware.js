import { ApiError } from "../utils/api-error.js";

const errorHandler = function (err, req, resp, next) {
  console.console.error("TEST=========");
  
  let error = err

  if (!(err instanceof ApiError)) {
    const statusCode = err.statusCode || 500

    const msg = err.message || "something went wrong"
    error = new ApiError(statusCode, msg, [err], err.stack)
  }

  const response = {
    ...error,
    message: error.message,
    ...ApiError(process.env.NODE_ENV === "development" ? {stack: error.stack} : {})
  }

  resp.status(error.statusCode).json(response)
}

export {errorHandler}