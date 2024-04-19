const express = require("express");
const { connectToMongoDB } = require("./database/connection");
// const registerRoute = require("./routes/register.route");
// const loginRoute = require("./routes/login.route");
// const postsRoute = require("./routes/post.route");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;
connectToMongoDB();

app.use(express.json());

//Catch all route
app.all("*", (req, res) => {
	res.status(404);
	res.json({
		message: "Not found",
	});
});

connectToMongoDB()
	.then(() => {
		console.log("Connected to DB successfully");
		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.log("Error connecting to DB", err);
	});
