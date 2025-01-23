const Joi = require("joi");

const validateBlogUser = (data) => {
    const schema = Joi.object({
        title: Joi.string().min(3).max(50).required(),
        content: Joi.string().min(5).max(150).required(),
        image: Joi.string(), // Changed from Image to image
    });
    return schema.validate(data);
}

module.exports = { validateBlogUser };
