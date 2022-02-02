const Review = require("../models/Review");
const handleAsync = require("../utils/HandleAsync");

exports.createReview = handleAsync(async (req, res, next) => {
	const review = await Review.create({ ...req.body, user: req.user.id });

	res.status(201).json({
		status: "Success",
		message: "Review created sucessfully",
		data: {
			review,
		},
	});
});

exports.getReviews = handleAsync(async (req, res, next) => {
	// const reviews = await Review.find({ user: req.user.id });
	const reviews = await Review.find();

	res.status(200).json({
		status: "Success",
		results: reviews.length,
		message: "Review fetched successfully",
		data: {
			reviews,
		},
	});
});
