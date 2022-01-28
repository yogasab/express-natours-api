const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const HandleAsync = require("../utils/HandleAsync");
const ErrorResponse = require("../utils/ErrorResponse");
const sendEmail = require("../utils/sendEmail");

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
		passwordChangedAt: req.body.passwordChangedAt,
	});

	// Generate Token
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

	// Generate Token
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	res.status(200).json({
		status: "Success",
		message: "Login successful",
		token,
		data: {
			user,
		},
	});
});

exports.forgotPassword = HandleAsync(async (req, res, next) => {
	const { email } = req.body;
	if (!email) {
		return next(new ErrorResponse("Please enter your email address", 400));
	}
	// Find the user by its email
	const user = await User.findOne({ email });
	if (!user) {
		return next(
			new ErrorResponse("There are no user with that email address", 404)
		);
	}
	// Generate random crypto token
	const resetToken = user.createResetPasswordToken();
	await user.save({ validateBeforeSave: false });

	// Send to user email
	const resetURL = `${req.protocol}://${req.get(
		"host"
	)}/api/v1/auth/reset-password/${resetToken}`;

	const message = `Forgot your password. Please submit a PATCH with your new password request to: ${resetURL}.\n Please ignore this if you not forget your password`;

	try {
		await sendEmail({
			email: user.email,
			subject: "Reset Password {valid for 10 mins}",
			message,
		});

		res.status(200).json({ status: "Success", message: "Email sent" });
	} catch (error) {
		user.resetPasswordToken = undefined;
		user.resetPasswordTokenExpired = undefined;
		await user.save({ validateBeforeSave: false });

		return next(
			new ErrorResponse(
				"There are error while sending email, please try again later",
				500
			)
		);
	}
});

exports.resetPassword = HandleAsync(async (req, res, next) => {
	const { token } = req.params;
	// Encrypt the token to compare it
	const encryptedToken = crypto
		.createHash("sha256")
		.update(token)
		.digest("hex");

	// Find the user by its reset token and reset password token
	const user = await User.findOne({
		resetPasswordToken: encryptedToken,
		resetPasswordTokenExpired: { $gt: Date.now() },
	});
	// If the token is not expired and there is a user, set new password, resetPasswordToken resetPasswordTokenExpired, passwordConfirmation
	if (!user) {
		return next(
			new ErrorResponse(
				"User is not found or expired token. Please try again",
				400
			)
		);
	}
	user.password = req.body.password;
	user.passwordConfirmation = req.body.passwordConfirmation;
	user.resetPasswordToken = null;
	user.resetPasswordTokenExpired = null;
	await user.save();
	// Update the passwordChangedAt
	// Login the user and send the token
	const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});

	res.status(200).json({
		status: "Success",
		message: "Password updated successfully",
		jwtToken,
	});
});
