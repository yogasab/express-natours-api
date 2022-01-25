const User = require("../models/User");
const HandleAsync = require("../utils/HandleAsync");

exports.signUp = HandleAsync(async (req, res, next) => {
	const user = await User.create(req.body);

	res.status(201).json({
		status: "Success",
		message: "User Sign Up successfully",
		data: {
			user,
		},
	});
});
