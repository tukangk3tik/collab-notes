const Joi = require("joi");

const postNoteSchema = Joi.object({
    owner_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
});

module.exports = postNoteSchema;