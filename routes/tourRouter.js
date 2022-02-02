const express = require("express");
const { createReview } = require("../controllers/ReviewController");
const {
	checkID,
	getTours,
	createTours,
	getTour,
	updateTour,
	deleteTour,
	aliasingQueryParams,
	getTourStats,
	getMonthlyPlan,
} = require("../controllers/TourController");
const ProtectRoute = require("../middlewares/protectRoute");
const RestrictTo = require("../middlewares/RestrictTo");
const tourRouter = express.Router();

// Middleware for checking route that requires an ID
tourRouter.param("id", checkID);

tourRouter.route("/").get(ProtectRoute, getTours).post(createTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/top-5-cheap").get(aliasingQueryParams, getTours);
tourRouter
	.route("/:id")
	.get(getTour)
	.patch(updateTour)
	.delete(ProtectRoute, RestrictTo("admin", "lead-guide"), deleteTour);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);

// Tour Reviews
// POST /tours/:tourId/reviews
// GET /tours/:tourId/reviews
tourRouter
	.route("/:tourId/reviews")
	.post(ProtectRoute, RestrictTo("user"), createReview);

module.exports = tourRouter;
