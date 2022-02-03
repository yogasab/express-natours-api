const Review = require("../models/Review");
const handleAsync = require("../utils/HandleAsync");

exports.createReview = handleAsync(async (req, res, next) => {
	// Nested Routes
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
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
