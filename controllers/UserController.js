const User = require("../models/User");
const ErrorResponse = require("../utils/ErrorResponse");
const handleAsync = require("../utils/HandleAsync");

// Create user only for admin
exports.createUser = async (req, res) => {
	// The Vulnerable One
	// const user = await User.create(req.body);
	// The Safest One
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: req.body.password,
		passwordConfirmation: req.body.passwordConfirmation,
	});

	res.status(201).json({
		status: "Success",
		message: "User created successfully",
	});
};

exports.getUsers = async (req, res) => {
	const users = await User.find();

	res.status(200).json({
		status: "Success",
		data: {
			users,
		},
	});
};

exports.getUser = handleAsync(async (req, res, next) => {
	const { id } = req.params;

	const user = await User.findById(id);

	res.status(200).json({
		status: "Success",
		message: "User fetched successfully",
		data: {
			user,
		},
	});
});

exports.deleteUser = handleAsync(async (req, res, next) => {
	const { id } = req.params;

	const user = await User.findByIdAndDelete(id);

	res
		.status(204)
		.json({ status: "Success", message: "User deleted successfully" });
});

exports.updateUser = handleAsync(async (req, res, next) => {
	const { id } = req.params;
	if (req.body.password || req.body.passwordConfirmation) {
		return next(
			new ErrorResponse("This routes doesn't support updating password")
		);
	}

	const user = await User.findByIdAndUpdate(id, req.body, {
		new: true,
		runValidators: true,
	});

	res.status(200).json({
		status: "Success",
		message: "User data updated successfully",
		data: {
			user,
		},
	});
});
