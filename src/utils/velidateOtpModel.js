const Joi = require('joi');

const validateOtpModel = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        otp: Joi.number().required(),
        type:Joi.string().required(),
    });
    return schema.validate(data);
};

module.exports = { validateOtpModel };