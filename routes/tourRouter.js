const express = require("express");
const {
	checkID,
	getTours,
	createTours,
	getTour,
	updateTour,
	deleteTour,
	aliasingQueryParams,
} = require("../controllers/tours");
const tourRouter = express.Router();

tourRouter.param("id", checkID);

tourRouter.route("/top-5-cheap").get(aliasingQueryParams, getTours);
tourRouter.route("/").get(getTours).post(createTours);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
