const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HandleAsync = require("../utils/HandleAsync");
const ErrorResponse = require("../utils/ErrorResponse");

const generateSignedToken = (id) => {
	jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
};

exports.signUp = HandleAsync(async (req, res, next) => {
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirmation: req.body.passwordConfirmation,
	});

	const token = generateSignedToken(user._id);

	res.status(201).json({
		status: "Success",
		message: "User Sign Up successfully",
		token,
		data: {
			user,
		},
	});
});

exports.signIn = HandleAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// Check if the email and password field is not empty
	if (!email || !password) {
		return next(new ErrorResponse("Please provide email or password", 400));
	}
	// Find user by email
	const user = await User.findOne({ email }).select("+password");
	// Check if hashed password is match
	if (!user || !(await user.comparePassword(password, user.password))) {
		return next(new ErrorResponse("Invalid credentials email/password", 401));
	}

	const token = generateSignedToken(user._id);

	res.status(200).json({
		status: "Success",
		message: "Login successful",
		token,
		data: {
			user,
		},
	});
});
