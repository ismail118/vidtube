import Joi from "joi";
import { ObjectId } from "mongodb";

const DB_NAME = "vidtube"

const JoiObjectId = Joi.extend((joi) => ({
  type: "objectId", // Custom Joi type
  base: joi.string(), // Extends Joi's string type
  messages: {
    "objectId.invalid": "{{#label}} must be a valid MongoDB ObjectId", // Custom error message
  },
  validate(value, helpers) {
    if (!ObjectId.isValid(value)) {
      return helpers.error("objectId.invalid"); // Return error if ObjectId is invalid
    }
    return { value }; // Otherwise, return the validated value
  },
}));
  

export { DB_NAME, JoiObjectId }