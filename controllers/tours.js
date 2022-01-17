const Tour = require("../models/Tour");

// Params Method Middleware
exports.checkID = (req, res, next, val) => {
	if (req.params.id * 1 > tours.length) {
		return res
			.status(404)
			.json({ status: "failed", message: "Tour not found" });
	}
	next();
};

exports.getTours = (req, res) => {
	res.status(200).json({ status: "Success" });
};

exports.createTours = (req, res) => {
	res.status(200).json({ status: "Success" });
};

exports.getTour = (req, res) => {
	res.status(200).json({ status: "Success" });
};

exports.updateTour = (req, res) => {
	res.status(200).json({ status: "Success" });
};

exports.deleteTour = (req, res) => {
	res.status(200).json({ status: "Success" });
};
