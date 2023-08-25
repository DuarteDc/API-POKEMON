import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
    PORT: Joi.number().default(3005),
    MONGODB_URI: Joi.required(),
    DEFAULT_LIMIT: Joi.number().default(10),
});

