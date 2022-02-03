const Review = require("../models/Review");
const handleAsync = require("../utils/HandleAsync");

exports.createReview = handleAsync(async (req, res, next) => {

	const review = await Review.create(req.body);

	res.status(201).json({
		status: "Success",
		message: "Review created sucessfully",
		data: {
			review,
		},
	});
});

exports.getReviews = handleAsync(async (req, res, next) => {
	let tour = {};
	if (req.params.tourId) tour = { tour: req.params.tourId };
	// const reviews = await Review.find({ user: req.user.id });
	const reviews = await Review.find(tour);

	res.status(200).json({
		status: "Success",
		results: reviews.length,
		message: "Review fetched successfully",
		data: {
			reviews,
		},
	});
});

exports.deleteReview = handleAsync(async (req, res, next) => {
	const { id } = req.params;
	await Review.findByIdAndDelete(id);

	res.status(204).json({
		status: "Success",
		message: "Review deleted successfully",
		data: null,
	});
});

exports.updateReview = handleAsync(async (req, res, next) => {
	const { id } = req.params;

	const review = await Review.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "Success",
		message: "Review updated successfully",
		data: {
			review,
		},
	});
});
