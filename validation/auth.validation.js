const Joi = require("joi");

const registerSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	userName: Joi.string(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

module.exports = { registerSchema };
