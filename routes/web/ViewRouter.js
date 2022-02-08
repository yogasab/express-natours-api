const express = require("express");
const { getOverview } = require("../../controllers/web/HomeController");
const { getTour } = require("../../controllers/web/TourController");
const viewRouter = express.Router();

viewRouter.get("/", getOverview);
viewRouter.get("/tour", getTour);

module.exports = viewRouter;
