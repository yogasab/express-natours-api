const mongoose = require("mongoose");

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

// Query Middleware to populate reviews relationship
ReviewSchema.pre(/^find/, function (next) {
	this.populate({ path: "tour", select: "name" }).populate({
		path: "user",
		select: "name photo",
	});
	next();
});

module.exports = new mongoose.model("Review", ReviewSchema);
