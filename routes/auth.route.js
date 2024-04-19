const { authController } = require("../controllers/auth.controller");
const validationMiddleware = require("../middleware/route.middleware");
const {
	registerSchema,
	loginSchema,
} = require("../validation/auth.validation");
const { Router } = require("express");

const authRouter = Router();

authRouter.post(
	"/register",
	validationMiddleware(registerSchema),
	authController.register
);

authRouter.post(
	"/login",
	validationMiddleware(loginSchema),
	authController.login
);

module.exports = authRouter;
