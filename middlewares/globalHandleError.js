const ErrorResponse = require("../utils/ErrorResponse");

const sendErrorDev = (res, err) => {
	res.status(err.statusCode).json({
		status: err.status,
		message: err.message,
		error: err,
		stack: err.stack,
	});
};

const sendErrorProd = (res, err) => {
	if (err.isOperational) {
		res.status(err.statusCode).json({
			status: err.status,
			message: err.message,
		});
	} else {
		res.status(500).json({ status: "Error", message: "Something went wrong" });
	}
};

const handleDuplicateValueFieldDB = (error) => {
	const value = error.keyValue.name;
	const message = `Duplicate field value ${value}. Please use another value`;
	return new ErrorResponse(message, 400);
};

const handleValidationErrorDB = (error) => {
	const errors = Object.values(error.errors).map((el) => el.message);
	const message = `Invalid input data. ${errors.join(`. `)}`;

	return new ErrorResponse(message, 400);
};

const handleJsonWebTokenError = (error) =>
	new ErrorResponse("Invalid token. Please try login again", 401);

const handleTokenExpiredError = (error) =>
	new ErrorResponse("Expired token. Please try login again", 401);

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "Error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(res, err);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (error.code === 11000) error = handleDuplicateValueFieldDB(error);
		console.log(error);
		if (error._message === "Validation failed")
			error = handleValidationErrorDB(error);
		// Handle Invalid Token
		if (error.name === "JsonWebTokenError")
			error = handleJsonWebTokenError(error);
		// Handle Expired Token
		if (error.name === "TokenExpiredError")
			error = handleTokenExpiredError(error);
		sendErrorProd(res, error);
	}
};
