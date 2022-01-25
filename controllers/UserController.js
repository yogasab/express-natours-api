const User = require("../models/User");

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
