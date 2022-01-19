const mongoose = require("mongoose");
const Tour = require("../models/Tour");
const APIFeature = require("../utils/APIFeature");

// Aliasing Request Query Middleware
exports.aliasingQueryParams = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingsAverage,price";
	req.query.fields = "name,summary,price,ratingsAverage";
	next();
};

// Params Method Middleware
exports.checkID = (req, res, next, val) => {
	// if (req.params.id * 1 > tours.length) {
	// 	return res
	// 		.status(404)
	// 		.json({ status: "failed", message: "Tour not found" });
	// }
	if (!mongoose.isValidObjectId(req.params.id)) {
		res.status(404).json({ status: "Failed", message: "Invalid ID of tour" });
	}
	req.id = req.params.id;
	next();
};

exports.checkBody = (req, res, next) => {
	if (!req.body.name || !req.body.price) {
		return res.status(400).json({
			status: "failed",
			message: "Missing name or price",
		});
	}
	next();
};

exports.createTours = async (req, res) => {
	try {
		const tour = await Tour.create(req.body);
		res.status(201).json({
			status: "Success",
			data: {
				tour,
			},
		});
	} catch (error) {
		const message = error.message.split(": ");
		res.status(400).json({ status: "Failed", message: message[2] });
	}
};

exports.getTours = async (req, res) => {
	try {
		// // Filtering
		// // Set the query params to new object
		// const queryObj = { ...req.query };
		// // Set the excluded field that doesnt belong in Tour Model
		// const excludedFields = ["page", "sort", "limit", "fields"];
		// // Loop through excluded field that doesnt macth in Tour Model
		// excludedFields.forEach((field) => delete queryObj[field]);

		// // Advance filtering using operator
		// // Convert JSON format to Object string format
		// let queryString = JSON.stringify(queryObj);
		// queryString = queryString.replace(
		// 	/\b(gte|gt|lte|lt)\b/g,
		// 	(matchedOperator) => `$${matchedOperator}`
		// );

		// // Model.prototype return query
		// let query = Tour.find(JSON.parse(queryString));

		// // Filtering by Sort
		// if (req.query.sort) {
		// 	// Split to array and join them with space
		// 	const sortBy = req.query.sort.split(",").join(" ");
		// 	// Second query criteria is applied/sorted when the first query have the same value
		// 	query = query.sort(sortBy);
		// } else {
		// 	query = query.sort("-createdAt");
		// }

		// // Selecting fields to return in response
		// if (req.query.fields) {
		// 	// Split to array and join them with space
		// 	const selectedFields = req.query.fields.split(",").join(" ");
		// 	// Return response only for the selected fields
		// 	query = query.select(selectedFields);
		// } else {
		// 	query = query.select("-__v");
		// }

		// // Pagination
		// const page = req.query.page * 1 || 1;
		// const limit = req.query.limit * 1 || 100;
		// const skip = (page - 1) * limit;

		// query = query.skip(skip).limit(limit);
		// // Validation to check if the number of page exist
		// if (req.query.page) {
		// 	const numTours = await Tour.countDocuments();
		// 	if (skip >= numTours) throw new Error("Page not found");
		// }

		// Model.prototype.query
		const features = new APIFeature(Tour.find(), req.query)
			.filter()
			.sort()
			.limitFields()
			.paginate();
		const tours = await features.query;

		res.status(200).json({
			status: "Success",
			results: tours.length,
			data: {
				tours,
			},
		});
	} catch (error) {
		res.status(500).json({ status: error.message });
	}
};

exports.getTour = async (req, res) => {
	console.log(req.id);
	try {
		const tour = await Tour.findById(req.id);
		res.status(200).json({
			status: "Success",
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(404).json({ status: "Failed", message: "Tour not found" });
	}
};

exports.updateTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndUpdate(req.id, req.body, {
			new: true,
			runValidators: true,
		});
		res.status(200).json({
			status: "Success",
			message: "Tour updated successfully",
			data: {
				tour,
			},
		});
	} catch (error) {
		res.status(400).json({ status: "Failed", message: error.message });
	}
};

exports.deleteTour = async (req, res) => {
	try {
		const tour = await Tour.findByIdAndDelete(req.id);
		res
			.status(204)
			.json({ status: "Success", message: "Tour deleted successfully" });
	} catch (error) {
		res.status(400).json({ status: "Failed", message: error.message });
	}
};
