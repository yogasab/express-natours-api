const express = require("express");
const {
	checkID,
	getTours,
	createTours,
	getTour,
	updateTour,
	deleteTour,
} = require("../controllers/tours");
const tourRouter = express.Router();

tourRouter.param("id", checkID);

tourRouter.route("/").get(getTours).post(createTours);
tourRouter.route("/:id").get(getTour).patch(updateTour).delete(deleteTour);

module.exports = tourRouter;
