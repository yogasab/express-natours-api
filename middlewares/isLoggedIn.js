const HandleAsync = require("../utils/HandleAsync");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const isLoggedIn = HandleAsync(async (req, res, next) => {
	// Check if there is a request headers authorization that starts with Bearer
	if (req.cookies.jwt) {
		// Verify Token
		const decoded = await jwt.verify(req.cookies.jwt, process.env.JWT_SECRET);
		// Check if the user is still after the signup | ie: The user is deleted
		const user = await User.findById(decoded.id);
		if (!user) {
			return next();
		}
		// Check if the user is changed the password after the token is issued iat
		if (user.changedPasswordAfter(decoded.iat)) {
			return next();
		}
		res.locals.user = user;
		return next();
	}
	next();
});

module.exports = isLoggedIn;
