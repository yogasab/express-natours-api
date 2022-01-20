const mongoose = require("mongoose");
const slugify = require("slugify");

const TourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, "Name must be filled"],
			unique: [true, "Name must be unique"],
			trim: true,
		},
		slug: {
			type: String,
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
			// required: [true, "A tour must have cover image"],
		},
		// Images that contains array of image
		images: [String],
		createdAt: {
			type: Date,
			default: Date.now(),
		},
		startDates: [Date],
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtuals
TourSchema.virtual("durationWeeks").get(function () {
	return Math.ceil(this.duration / 7);
});

// Document Middleware: runs before .save() or .create() not .saveMany()
TourSchema.pre("save", function (next) {
	this.slug = slugify(this.name, { lower: true });
	next();
	// console.log("Running pre save middleware 1");
});

// TourSchema.pre("save", function (next) {
// 	console.log("Running pre save middleware 2");
// 	next();
// });

// TourSchema.post("save", function (doc, next) {
// 	console.log("Running post middleware");
// 	next();
// });

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
