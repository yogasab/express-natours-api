const ErrorResponse = require("../utils/ErrorResponse");

const RestrictTo = (...role) => {
	return (req, res, next) => {
		// If the user role is not admin or lead-guide
		if (!role.includes(req.user.role)) {
			return next(
				"You dont have access to apply this routes. Please contact an adminstrator",
				403
			);
		}

		next();
	};
};

module.exports = RestrictTo;
