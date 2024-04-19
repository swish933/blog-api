const express = require("express");
const { connectToMongoDB } = require("./database/connection");
const authRoute = require("./routes/auth.route");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());

app.use("/auth", authRoute);

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
