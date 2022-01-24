const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE_CLOUD_URI;

mongoose
	.connect(
		"mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
		{
			useNewUrlParser: true,
			useCreateIndex: true,
			useFindAndModify: true,
			useUnifiedTopology: true,
		}
	)
	.then((con) => {
		console.log(
			`Database connected successfully at ${con.connection.host} on ${process.env.NODE_ENV}`
		);
	})
	.catch((err) => {
		console.log(err);
	});

// Server
const PORT = process.env.PORT | 5000;
app.listen(PORT, () => {
	console.log(`Server running on localhost:${PORT}`);
});
