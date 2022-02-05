const mongoose = require("mongoose");
const Tour = require("./Tour");

const ReviewSchema = new mongoose.Schema({
	review: {
		type: String,
		trim: true,
		required: [true, "Please add your honest review"],
	},
	rating: {
		type: Number,
		required: [true, "Please leave a rating"],
		min: [1, "Rating must be greater or equal to 1"],
		max: [5, "Rating must be less or equal to 5"],
		default: 4.5,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	tour: {
		type: mongoose.Schema.ObjectId,
		ref: "Tour",
		required: [true, "Review must be belong to Tour"],
	},
	user: {
		type: mongoose.Schema.ObjectId,
		ref: "User",
		required: [true, "Review must be belong to User"],
	},
});

// Set user and tour index to 1 so user only be able to create only on review
ReviewSchema.index({ tour: 1, user: 1 }, { unique: true });

// Query Middleware to populate reviews relationship
ReviewSchema.pre(/^find/, function (next) {
	// One to Many relationship looklike
	// this.populate({ path: "tour", select: "name" }).populate({
	// 	path: "user",
	// 	select: "name photo",
	// });
	this.populate({
		path: "user",
		select: "name photo",
	});
	next();
});

ReviewSchema.statics.calculateAverageRating = async function (tourId) {
	const stats = await this.aggregate([
		{
			$match: { tour: tourId },
		},
		{
			$group: {
				_id: "$tour",
				nRatings: { $sum: 1 },
				avgRatings: { $avg: "$rating" },
			},
		},
	]);
	// Prevent Error if the nRatings is 0
	if (stats.length > 0) {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: stats[0].nRatings,
			ratingsAverage: stats[0].avgRatings,
		});
	} else {
		await Tour.findByIdAndUpdate(tourId, {
			ratingsQuantity: 0,
			ratingsAverage: 4.5,
		});
	}
	console.log(stats);
};

ReviewSchema.post("save", function () {
	// Have access to current model Tour.calculateAverageRating(id)
	this.constructor.calculateAverageRating(this.tour);
});

// Update Rewiew Rating on findOneAndUpdate & findOneAndDelete
// Take the tour id and set to const
ReviewSchema.pre(/findOneAnd/, async function (next) {
	const review = await this.findOne();
	// Set to current model
	this.ReviewModel = review;
	next();
});

ReviewSchema.post(/findOneAnd/, async function () {
	// Call the model constructor and calculate average rating
	this.ReviewModel.constructor.calculateAverageRating(this.ReviewModel.tour);
});

module.exports = new mongoose.model("Review", ReviewSchema);
