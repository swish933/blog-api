const Joi = require("joi");

const blogSchema = Joi.object({
	title: Joi.string().min(5).required(),
	description: Joi.string().min(5),
	tags: Joi.array().items(Joi.string()),
	body: Joi.string().min(5).required(),
});

module.exports = { blogSchema };
