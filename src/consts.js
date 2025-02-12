import Joi from "joi";

export const DB_NAME = "vidtube"

const JoiObjectId = Joi.extend({
    type: 'objectId',
    base: Joi.string(),
    messages: {
      'objectId.format': '{{#label}} must be a valid MongoDB ObjectId',
    },
    rules: {
      format: {
        validate(value, helpers) {
          if (!/^[0-9a-fA-F]{24}$/.test(value)) {
            return { value, errors: helpers.error('objectId.format') };
          }
          return value;
        }
      }
    }
});