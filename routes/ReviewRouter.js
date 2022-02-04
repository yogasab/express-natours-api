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

reviewRouter.use(protectRoute);

reviewRouter
	.route("/")
	.post(restrictTo("user"), setUserAndTourID, createReview)
	.get(getReviews);

reviewRouter
	.route("/:id")
	.get(getReview)
	.delete(restrictTo("user", "admin"), deleteReview)
	.patch(restrictTo("user", "admin"), updateReview);

module.exports = reviewRouter;
