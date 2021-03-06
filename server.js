const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

// Error Handling Events
// process.on("uncaughtException", (err) => {
// 	console.log(err.name, err.message);
// 	console.log(`UNHANDLED REJECTION! Shutting Down Server ...`);
// 	process.exit(1);
// });

const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE_CLOUD_URI;

mongoose
	.connect("mongodb://127.0.0.1/natours", {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: true,
		useUnifiedTopology: true,
	})
	.then((con) => {
		console.log(
			`Database connected successfully at ${con.connection.host} on ${process.env.NODE_ENV}`
		);
	});

// Server
const PORT = process.env.PORT | 5000;
const server = app.listen(PORT, () => {
	console.log(`Server running on localhost:${PORT}`);
});

// Error Handling Events
// process.on("unhandledRejection", (err) => {
// 	console.log(err.name, err.message);
// 	console.log(`UNHANDLED REJECTION! Shutting Down Server ...`);
// 	server.close((err) => {
// 		process.exit(1);
// 	});
// });
