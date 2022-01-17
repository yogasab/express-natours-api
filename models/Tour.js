const mongoose = require("mongoose");

const TourSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name must be filled"],
		unique: [true, "Name must be unique"],
	},
	price: {
		type: Number,
	},
	rating: {
		type: Number,
		default: 0,
	},
});

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
