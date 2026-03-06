const validateMiddleware = (schema) => (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false }); // abortEarly: false returns all errors

    if (error) {
        const errorMessages = error.details.map(detail => detail.message);
        return res.status(400).json({
            status: 'error',
            message: 'Bad request',
            errors: errorMessages
        });
    }
    // On success, replace the request body with the Joi-validated value (which may have type conversions, etc.)
    req.body = value;
    next();
};

module.exports = validateMiddleware;