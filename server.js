const express = require("express");
const errorHandler = require("./middleware/error.middleware.js");
const { connectToMongoDB } = require("./database/connection");
const redisClient = require("./integrations/redis");
const authRoute = require("./routes/auth.route");
const blogsRoute = require("./routes/blog.route");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

connectToMongoDB();
redisClient.connect();

app.use(express.json());

app.use("/auth", authRoute);
app.use("/blogs", blogsRoute);

//Catch all route
app.all("*", (req, res) => {
	res.status(404);
	res.json({
		message: "Not found",
	});
});

app.use(errorHandler);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
