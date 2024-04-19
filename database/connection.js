const mongoose = require("mongoose");
require("dotenv").config();

// connect to mongodb
async function connectToMongoDB() {
	const { MONGODB_URI } = process.env;
	if (MONGODB_URI) {
		return await mongoose.connect(MONGODB_URI);
	}
}

module.exports = { connectToMongoDB };
