const ErrorResponse = require("../utils/ErrorResponse");
const HandleAsync = require("../utils/HandleAsync");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const ProtectRoute = HandleAsync(async (req, res, next) => {
	// let token;
	// // Check if there is a request headers authorization that starts with Bearer
	// if (
	// 	req.headers.authorization &&
	// 	req.headers.authorization.startsWith("Bearer")
	// ) {
	// 	token = req.headers.authorization.split(" ")[1];
	// }
	// // Check if the token is not null
	// if (!token) {
	// 	return next(
	// 		new ErrorResponse(
	// 			"You are not logged in. Please login to get access",
	// 			401
	// 		)
	// 	);
	// }
	// // Verify Token
	// const decoded = await jwt.verify(token, process.env.JWT_SECRET);

	// // Check if the user is still exist ie: The user is deleted
	// const user = await User.findById(decoded.id);
	// if (!user) {
	// 	return next(
	// 		new ErrorResponse(
	// 			"The user belonging to this token is no longer exist",
	// 			401
	// 		)
	// 	);
	// }

	// // Check if the user is changed the password after the token is issued iat
	// if (user.changedPasswordAfter(decoded.iat)) {
	// 	return next(
	// 		new ErrorResponse(
	// 			`User recenlty changed password. Please login again`,
	// 			401
	// 		)
	// 	);
	// }

	// Check if there is a request headers authorization that starts with Bearer
	let token;
	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer ")
	) {
		token = req.headers.authorization.split(" ")[1];
	}
	// Check if the token is not null
	if (!token) {
		return next(
			new ErrorResponse(
				"You are not logged in. Please login to get access",
				401
			)
		);
	}

	// Verify Token
	const decoded = await jwt.verify(token, process.env.JWT_SECRET);

	// Check if the user is still after the signup | ie: The user is deleted
	const user = await User.findById(decoded.id);
	if (!user) {
		return next(
			new ErrorResponse(
				"The user belonging to this token is no longer exist",
				401
			)
		);
	}

	// Check if the user is changed the password after the token is issued iat
	if (user.changedPasswordAfter(decoded.iat)) {
		return next(
			new ErrorResponse(
				"User recenlty changed password. Please login again",
				401
			)
		);
	}

	req.user = user;
	next();
});

module.exports = ProtectRoute;
