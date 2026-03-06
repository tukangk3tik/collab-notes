const Joi = require("joi");

const postOperationSchema = Joi.object({
    user_id: Joi.uuid().required(),
    base_version: Joi.number().required(),
    type: Joi.string().required(),
    position: Joi.number().required(),
    content: Joi.string(),
    length: Joi.number(),
}).xor("content", "length");

module.exports = postOperationSchema;