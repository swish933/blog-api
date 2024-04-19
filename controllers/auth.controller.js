const { authService } = require("../services/auth.service");

const register = async (req, res) => {
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
		console.log(error);
		res.status(error.status || 500);
		res.send({ message: error.message });
	}
};

const login = async (req, res) => {
	const { email, userName, password } = req.body;
	try {
		const { accessToken, user } = await authService.loginUser(
			email,
			userName,
			password
		);
		res.send({ message: "Login successful", data: { accessToken, user } });
	} catch (error) {
		console.log(error);
		res.status(error.status || 500);
		res.send({ message: error.message });
	}
};

const authController = { register, login };

module.exports = { authController };
