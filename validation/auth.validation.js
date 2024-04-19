const Joi = require("joi");

const registerSchema = Joi.object({
	firstName: Joi.string().required(),
	lastName: Joi.string().required(),
	userName: Joi.string(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).required(),
	confirmPassword: Joi.any().valid(Joi.ref("password")).required(),
});

const loginSchema = Joi.object({
	email: Joi.string().email(),
	userName: Joi.string(),
	password: Joi.string().min(6).required(),
}).xor("email", "userName");

module.exports = { registerSchema, loginSchema };
