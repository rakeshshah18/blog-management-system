const Joi = require("joi")

const validateUser = (data) => {
    const schema = Joi.object({
        userName: Joi.string().min(3).max(20).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(8).required(),
        age: Joi.number().integer().min(18).max(100).required(),
    });
    return schema.validate(data);
};

module.exports = { validateUser };

