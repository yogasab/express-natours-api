const express = require("express");
const { createReview, getReviews } = require("../controllers/ReviewController");
const protectRoute = require("../middlewares/protectRoute");
const restrictTo = require("../middlewares/RestrictTo");

const reviewRouter = express.Router({ mergeParams: true });

// reviewRouter
// 	.route("/")
// 	.post(protectRoute, restrictTo("user"), createReview)
// 	.get(protectRoute, getReviews);

reviewRouter
	.route("/")
	.post(protectRoute, restrictTo("user"), createReview)
	.get(protectRoute, getReviews);

module.exports = reviewRouter;
