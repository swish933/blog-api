const generateMiddleware = (schema) => {
	return (req, res, next) => {
		if (schema) {
			const result = schema.validate(req.body);
			if (result.error) {
				return res.status(400).send({ errors: result.error });
			}
		}
		next();
	};
};

module.exports = generateMiddleware;
