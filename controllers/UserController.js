const User = require("../models/User");

// Create user only for admin
exports.createUser = async (req, res) => {
	const user = await User.create(req.body);

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
