const express = require("express");
const { getOverview } = require("../../controllers/web/HomeController");
const { getTour } = require("../../controllers/web/TourController");
const viewRouter = express.Router();

viewRouter.get("/", getOverview);
viewRouter.get("/tours/:slug", getTour);

module.exports = viewRouter;
