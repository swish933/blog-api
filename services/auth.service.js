const bcrypt = require("bcrypt");
const Jwt = require("jsonwebtoken");
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

const loginUser = async (userInfo, password) => {
	const user = await User.findOne({
		$or: [{ email: userInfo }, { userName: userInfo }],
	});

	if (!user) {
		throw new ErrorWithStatus("User not found. Please register", 404);
	}

	const isValid = bcrypt.compareSync(password, user.password);

	if (!isValid) {
		throw new ErrorWithStatus("Username/Email or password incorrect", 401);
	}

	const JWT_SECRET = process.env.JWT_SECRET;
	const token = Jwt.sign(
		{
			email: user.email,
			id: user.id,
			sub: user.id,
		},
		JWT_SECRET,
		{ expiresIn: "1h" }
	);

	return { accessToken: token, user };
};

const authService = { registerUser, loginUser };
module.exports = { authService };
