const fs = require("fs");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Tour = require("../../models/Tour");

dotenv.config({ path: "./config.env" });

const DB = "mongodb://127.0.0.1/natours";

mongoose
	.connect(DB, {
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

const tours = JSON.parse(fs.readFileSync("../data/tours.json"));

// Seed data
const importData = async () => {
	try {
		await Tour.create(tours);
		console.log("Tours seeded successfully");
	} catch (error) {
		console.log(error);
	}
	process.exit();
};
// Delete data
const deleteData = async () => {
	try {
		await Tour.deleteMany();
		console.log("Tours deleted successfully");
	} catch (error) {
		console.log(error);
	}
	process.exit();
};

if (process.argv[2] === "import" || process.argv[2] === "-i") {
	importData();
} else if (process.argv[2] === "delete" || process.argv[2] === "-d") {
	deleteData();
}
