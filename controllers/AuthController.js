const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const handleAsync = require("../utils/HandleAsync");
const ErrorResponse = require("../utils/ErrorResponse");
const sendEmail = require("../utils/sendEmail");

const sendResponseToken = (res, user, statusCode, status, message) => {
	const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRES_IN,
	});
	const tokenOptions = {
		expires: new Date(
			Date.now() * process.env.JWT_COOKIE_EXPIRES_IN * 24 * 3600 * 1000
		),
		httpOnly: true,
	};
	// Set to secure flag if it is in production
	if (process.env.NODE_ENV === "production") tokenOptions.secure = true;
	// Set JWT to Response Cookies for the safest way
	res.cookie("jwt", token, tokenOptions);
	user.password = undefined;

	res.status(statusCode).json({
		status,
		message,
		token,
		data: {
			user,
		},
	});
};

const filterAllowedField = (body, ...allowedFields) => {
	const filteredField = {};
	Object.keys(body).forEach((field) => {
		// if the req.body contains the name and email
		if (allowedFields.includes(field)) {
			// Set the key value pair
			filteredField[field] = body[field];
		}
	});
	return filteredField;
};

exports.signUp = handleAsync(async (req, res, next) => {
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirmation: req.body.passwordConfirmation,
		passwordChangedAt: req.body.passwordChangedAt,
	});

	// Generate Token
	sendResponseToken(res, user, 201, "Success", "User sign up successfully");
});

exports.signIn = handleAsync(async (req, res, next) => {
	const { email, password } = req.body;
	// Check if the email and password field is not empty
	if (!email || !password) {
		return next(new ErrorResponse("Please provide email or password", 400));
	}
	// Find user by email
	const user = await User.findOne({ email }).select("+password");
	// // Check if hashed password is match
	if (!user || !(await user.comparePassword(password, user.password))) {
		return next(new ErrorResponse("Invalid credentials email/password", 401));
	}

	// Generate Token
	sendResponseToken(res, user, 200, "Success", "User signin successfully");
});

exports.forgotPassword = handleAsync(async (req, res, next) => {
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

exports.resetPassword = handleAsync(async (req, res, next) => {
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

exports.updatePassword = handleAsync(async (req, res, next) => {
	const { id } = req.user;
	const { currentPassword, password, passwordConfirmation } = req.body;
	// Get the user from collection by its id
	const user = await User.findById(id).select("+password");
	// Check if the current password is correct by compare it
	const isPasswordMatch = await user.comparePassword(
		currentPassword,
		user.password
	);
	if (!isPasswordMatch) {
		return next(new ErrorResponse("Password doen't match", 401));
	}
	// If yes, update password
	user.password = password;
	user.passwordConfirmation = passwordConfirmation;
	await user.save();
	// Log the user in and generate token
	sendResponseToken(res, user, 200, "Success", "Password updated successfully");
});

exports.updateMe = handleAsync(async (req, res, next) => {
	const { name, password, passwordConfirmation } = req.body;
	const { body } = req;
	const { id } = req.user;
	// Check if there are password or passwordConfirmation field
	if (password || passwordConfirmation) {
		return next(new ErrorResponse("Cannot update password here", 400));
	}

	// Check only the allowedField to be able to update
	const filteredFields = filterAllowedField(body, "name", "email");

	// Find by id and update user
	const user = await User.findByIdAndUpdate(id, filteredFields, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "Success",
		message: "User profile updated successfully",
		data: {
			user,
		},
	});
});

exports.deleteMe = handleAsync(async (req, res, next) => {
	const { id } = req.user;

	const user = await User.findByIdAndUpdate(id, { active: false });

	res.status(204).json();
});

exports.getMe = handleAsync(async (req, res, next) => {
	const { user } = req;
	res.status(200).json({
		status: "Success",
		message: "User fetched successfully",
		data: { user },
	});
});
