const { authController } = require("../controllers/auth.controller");
const validationMiddleware = require("../middleware/route.middleware");
const { registerSchema } = require("../validation/auth.validation");
const { Router } = require("express");

const authRouter = Router();

authRouter.post(
	"/register",
	validationMiddleware(registerSchema),
	authController.register
);

module.exports = authRouter;
