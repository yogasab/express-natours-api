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
		console.error(`ERROR ${err}`);
		res.status(500).json({ status: "Error", message: "Something went wrong" });
	}
};

const handleDuplicateValueFieldDB = (error) => {
	console.log(error.keyValue.name);
	const value = error.keyValue.name;
	const message = `Duplicate field value ${value}. Please use another value`;
	return new ErrorResponse(message, 400);
};

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "Error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(res, err);
	} else if (process.env.NODE_ENV === "production") {
		let error = { ...err };
		if (error.code === 11000) error = handleDuplicateValueFieldDB(error);
		sendErrorProd(res, error);
	}
};
