const { authService } = require("../services/auth.service");

const register = async (req, res, next) => {
	const { firstName, lastName, userName, email, password } = req.body;
	try {
		const newUser = await authService.registerUser(
			firstName,
			lastName,
			userName,
			email,
			password
		);
		res.send({ message: "User created successfully", data: newUser });
	} catch (error) {
		next(error);
	}
};

const login = async (req, res, next) => {
	const { email, userName, password } = req.body;

	const userInfo = !email ? userName : email;

	try {
		const { accessToken, user } = await authService.loginUser(
			userInfo,
			password
		);
		res.send({ message: "Login successful", data: { accessToken, user } });
	} catch (error) {
		next(error);
	}
};

const authController = { register, login };

module.exports = { authController };
