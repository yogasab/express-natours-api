const express = require("express");
const {
	createReview,
	getReviews,
	deleteReview,
	updateReview,
	getReview,
} = require("../controllers/ReviewController");
const protectRoute = require("../middlewares/protectRoute");
const restrictTo = require("../middlewares/RestrictTo");
const setUserAndTourID = require("../middlewares/setUserAndTourID");

// reviewRouter
// POST /tours/:tourId/reviews (mergeParams)
// GET /tours/:tourId/reviews
const reviewRouter = express.Router({ mergeParams: true });

reviewRouter
	.route("/")
	.post(protectRoute, restrictTo("user"), setUserAndTourID, createReview)
	.get(protectRoute, getReviews);

reviewRouter
	.route("/:id")
	.get(protectRoute, getReview)
	.delete(protectRoute, deleteReview)
	.patch(protectRoute, updateReview);

module.exports = reviewRouter;
