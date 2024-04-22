const mongoose = require("mongoose");
require("dotenv").config();

// connect to mongodb
function connectToMongoDB() {
	const { MONGODB_URI } = process.env;

	mongoose.connect(MONGODB_URI);

	mongoose.connection.on("connected", () => {
		console.log("Connected to MongoDB successfully");
	});

	mongoose.connection.on("error", (error) => {
		console.log("Error connecting to MongoDB", err);
	});
}

module.exports = { connectToMongoDB };
