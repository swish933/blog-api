const errorHandler = (err, req, res, next) => {
	console.log(error);
	res.status(error.status || 500);
	res.json({ message: error.message });
};

module.exports = errorHandler;
