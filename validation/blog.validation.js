const Joi = require("joi");
const { BlogStateOptions } = require("../util/constant");

const blogSchema = Joi.object({
	title: Joi.string().min(5).required(),
	description: Joi.string().min(5),
	tags: Joi.array().items(Joi.string()),
	body: Joi.string().min(5).required(),
});

const publishBlogSchema = Joi.object({
	state: Joi.string()
		.valid(BlogStateOptions.draft, BlogStateOptions.published)
		.required(),
});

module.exports = { blogSchema, publishBlogSchema };
