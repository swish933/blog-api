const Jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization) {
		return res.status(401).send({ message: "Unauthorized" });
	}

	const bearerToken = authorization.split(" ");
	if (bearerToken.length !== 2) {
		return res.status(401).send({ message: "Unauthorized" });
	}

	const token = bearerToken[1];

	try {
		const decoded = Jwt.verify(token, process.env.JWT_SECRET);
		req.user = decoded;
		next();
	} catch (error) {
		console.error(error);
		return res.status(401).send({ message: "Unauthorized" });
	}
};

module.exports = authMiddleware;
