const mongoose = require("mongoose");
const slugify = require("slugify");
const validator = require("validator");
const User = require("./User");

const TourSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			trim: true,
			required: [true, "Name must be filled"],
			unique: [true, "Name must be unique"],
			maxLength: [40, "Name must have less or equal 40 characters"],
			minLength: [10, "Name must have greater or equal 10 characters"],
			// validate: [validator.isAlpha, "Tour name must only contains character"],
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
			enum: {
				values: ["easy", "medium", "difficult"],
				message: "The difficulty either easy, medium, difficult",
			},
		},
		ratingsAverage: {
			type: Number,
			default: 4.5,
			min: [1, "Rating must be equal or greater than 1"],
			max: [5, "Rating must be equal or less than 5"],
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
			validate: {
				// This validation only points to newly created document no updated document
				validator: function (enteredValue) {
					return enteredValue < this.price;
				},
				message: `Discount price {VALUE} must be below that regular price`,
			},
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
		secretTour: {
			type: Boolean,
			default: false,
		},
		startLocation: {
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			// Defining Embedded Documents
			coordinates: [Number],
			address: [String],
			description: [String],
		},
		location: {
			type: {
				type: String,
				default: "Point",
				enum: ["Point"],
			},
			// Defining Embedded Documents
			coordinates: [Number],
			address: [String],
			description: [String],
			day: Number,
		},
		// Embedding Document
		// guides: Array,
		guides: [
			{
				// Child Referencing
				type: mongoose.Schema.ObjectId,
				ref: "User",
			},
		],
		// reviews: [
		// 	{
		// 		type: mongoose.Schema.ObjectId,
		// 		ref: "Review",
		// 	},
		// ],
	},
	// Virtual Propperty
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
	}
);

// Virtuals Property
TourSchema.virtual("durationWeeks").get(function () {
	return Math.ceil(this.duration / 7);
});
// Virtual Populate | Many to One looklike
TourSchema.virtual("reviews", {
	ref: "Review",
	foreignField: "tour",
	localField: "_id",
});

// Document Middleware: runs before .save() or .create() not .saveMany()
TourSchema.pre("save", function (next) {
	// We have access to the current Model
	this.slug = slugify(this.name, { lower: true });
	next();
	// console.log("Running pre save middleware 1");
});

// Document Middleware: to embedding document or show to response with coressponding guide
// TourSchema.pre("save", async function (next) {
// 	const guides = this.guides.map(async (id) => await User.findById(id));
// 	this.guides = await Promise.all(guides);
// 	next();
// });

// TourSchema.pre("save", function (next) {
// 	console.log("Running pre save middleware 2");
// 	next();
// });
// TourSchema.post("save", function (doc, next) {
// 	console.log("Running post middleware");
// 	next();
// });

// Query Middleware: runs before all the methods that starts with .find()
// TourSchema.pre("find", function (next) {
TourSchema.pre(/^find/, function (next) {
	// We have access to query
	this.find({ secretTour: { $ne: true } });
	// Define an arbitary object
	this.duration = Date.now();
	next();
});
// Query Middleware to populate relation in Tour
TourSchema.pre(/^find/, function (next) {
	// have access to query
	this.populate({ path: "guides", select: "-__v" });
	next();
});
// Query Middleware: runs before all the methods that starts with .find()
TourSchema.post(/^find/, function (docs, next) {
	console.log(`Query took ${Date.now() - this.duration} milliseconds`);
	next();
});

// Aggregation Midleware: runs before .aggregate()
TourSchema.pre("aggregate", function (next) {
	// We have access to aggregation to run this match before aggregation in controller
	this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
	next();
});

const Tour = mongoose.model("Tour", TourSchema);

module.exports = Tour;
