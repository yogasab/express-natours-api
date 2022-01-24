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

module.exports = (err, req, res, next) => {
	err.statusCode = err.statusCode || 500;
	err.status = err.status || "Error";

	if (process.env.NODE_ENV === "development") {
		sendErrorDev(res, err);
	} else if (process.env.NODE_ENV === "production") {
		sendErrorProd(res, err);
	}
};
