const express = require("express");
const { getLoginForm } = require("../../controllers/web/AuthController");
const { getOverview } = require("../../controllers/web/HomeController");
const { getTour } = require("../../controllers/web/TourController");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const viewRouter = express.Router();

viewRouter.use(isLoggedIn);

viewRouter.get("/", getOverview);
viewRouter.get("/login", getLoginForm);
viewRouter.get("/tours/:slug", getTour);

module.exports = viewRouter;
