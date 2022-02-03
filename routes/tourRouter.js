const express = require("express");
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
const reviewRouter = require("./ReviewRouter");
const tourRouter = express.Router();

// Middleware for checking route that requires an ID
tourRouter.param("id", checkID);

// Tour Reviews use reviewRouter as middleware
// POST /tours/:tourId/reviews
// GET /tours/:tourId/reviews
tourRouter.use("/:tourId/reviews", reviewRouter);

tourRouter.route("/").get(ProtectRoute, getTours).post(createTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/top-5-cheap").get(aliasingQueryParams, getTours);
tourRouter
	.route("/:id")
	.get(getTour)
	.patch(updateTour)
	.delete(ProtectRoute, RestrictTo("admin", "lead-guide"), deleteTour);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);

module.exports = tourRouter;
