const mongoose = require("mongoose");

const TourSchema = mongoose.Schema({
	name: {
		type: String,
		required: [true, "Name must be filled"],
		unique: [true, "Name must be unique"],
		trim: true,
	},
	duration: {
		type: Number,
		required: [true, "A tour must have durations"],
	},
	maxGroupSize: {
		type: Number,
		required: [true, "A tour must have group size"],
	},
	difficulty: {
		type: String,
		required: [true, "A tour must have difficulty"],
	},
	ratingsAverage: {
		type: Number,
		default: 0,
	},
	ratingsQuantity: {
		type: Number,
		default: 0,
	},
	price: {
		type: Number,
		required: [true, "A tour must have price"],
	},
	priceDiscount: {
		type: Number,
	},
	summary: {
		type: String,
		trim: true,
		trim: [true, "A tour must have description"],
	},
	description: {
		type: String,
		trim: true,
	},
	imageCover: {
		type: String,
		required: [true, "A tour must have cover image"],
	},
	// Images that contains array of image
	images: [String],
	createdAt: {
		type: Date,
		default: Date.now(),
	},
	startDates: [Date],
});

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
