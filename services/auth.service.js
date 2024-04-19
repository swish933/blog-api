const bcrypt = require("bcrypt");
const User = require("../database/schemas/user.schema");
const {
	ErrorWithStatus,
} = require("../exceptions/error-with-status.exception.js");

const registerUser = async (firstName, lastName, userName, email, password) => {
	const user = await User.findOne({ email });

	if (user) {
		throw new ErrorWithStatus("User already exists", 400);
	}

	const saltRounds = 10;

	password = await bcrypt.hash(password, saltRounds);

	const newUser = new User({
		firstName,
		lastName,
		userName,
		email,
		password,
	});

	await newUser.save();

	return newUser;
};

const authService = { registerUser };
module.exports = { authService };
