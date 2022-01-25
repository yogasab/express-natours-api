const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HandleAsync = require("../utils/HandleAsync");

exports.signUp = HandleAsync(async (req, res, next) => {
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirmation: req.body.passwordConfirmation,
	});

	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	res.status(201).json({
		status: "Success",
		message: "User Sign Up successfully",
		token,
		data: {
			user,
		},
	});
});
