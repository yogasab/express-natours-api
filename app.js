const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const hpp = require("hpp");
const userRouter = require("./routes/userRouter");
const TourRouter = require("./routes/TourRouter");
const ErrorResponse = require("./utils/ErrorResponse");
const globalHandleError = require("./middlewares/globalHandleError");
const authRouter = require("./routes/AuthRouter");

const app = express();
app.use(helmet());
// Limit Request
const limiter = rateLimit({
	windowMs: process.env.TIME_RATE_LIMIT * 60 * 1000, // 15 minutes,
	max: 100,
	message: `Too many request. Please try again in ${process.env.TIME_RATE_LIMIT} minutes`,
});

// Logging up development
if (process.env.NODE_ENV === "development") {
	app.use(morgan("dev"));
}
// Limit Request
app.use("/api", limiter);
// Body parser reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
// Data Sanitazation againg NOSQL Injection
app.use(mongoSanitize());
// Data Sanitization against XSS Attack
app.use(xss());
// To prevent parameter pollution
app.use(hpp());
// Serving static files
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
app.use("/api/v1/tours", TourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);

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
