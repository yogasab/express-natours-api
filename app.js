const express = require("express");
const morgan = require("morgan");
// const userRouter = require("./routes/userRouter");
const tourRouter = require("./routes/tourRouter");
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
	res.status(404).json({
		status: "Failed",
		message: `The routes for ${req.originalUrl} is not found`,
	});
});

module.exports = app;
