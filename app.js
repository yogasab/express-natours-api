const express = require("express");
const morgan = require("morgan");
// const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/TourRouter");
const ErrorResponse = require("./utils/ErrorResponse");
const globalHandleError = require("./middlewares/globalHandleError");
const app = express();

// Middleware
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// app.use((req, res, next) => {
// 	console.log("Testing middleware");
// 	next();
// });
app.use((req, res, next) => {
	// Set request time to header
	req.requestTime = new Date().toISOString();
	next();
});

// Mounting Router
app.use("/api/v1/tours", tourRouter);
// app.use("/api/v1/users", userRouter);

// Error handling for unavailable routes that defined in above
app.all("*", (req, res, next) => {
	// res.status(404).json({
	// 	status: "Failed",
	// 	message: `The routes for ${req.originalUrl} is not found`,
	// });

	// Send The Error to next error handling middleware
	// const err = new Error(`The routes for ${req.originalUrl} is not found`);
	// err.statusCode = 404;
	// err.status = "Failed";

	// Everything that pass as argument in next method is error
	next(
		new ErrorResponse(`The routes for ${req.originalUrl} is not found`, 404)
	);
});

// Use err as first argument to create Global Handling Error
app.use(globalHandleError);

module.exports = app;
