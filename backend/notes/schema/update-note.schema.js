const Joi = require("joi");

const updateNoteSchema = Joi.object({
    user_id: Joi.string().uuid().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
});

module.exports = updateNoteSchema;