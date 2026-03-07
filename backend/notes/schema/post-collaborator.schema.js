const Joi = require("joi");

const postCollaboratorSchema = Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().valid("editor", "viewer").required(),
});

module.exports = postCollaboratorSchema;