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
const tourRouter = express.Router();

// Middleware for checking route that requires an ID
tourRouter.param("id", checkID);

tourRouter.route("/").get(ProtectRoute, getTours).post(createTours);
tourRouter.route("/tour-stats").get(getTourStats);
tourRouter.route("/top-5-cheap").get(aliasingQueryParams, getTours);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);

module.exports = tourRouter;
