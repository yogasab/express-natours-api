const mongoose = require("mongoose");
const Tour = require("../models/Tour");
const APIFeature = require("../utils/APIFeature");
const ErrorResponse = require("../utils/ErrorResponse");
const HandleAsync = require("../utils/HandleAsync");

// Aliasing Request Query Middleware
exports.aliasingQueryParams = (req, res, next) => {
	req.query.limit = "5";
	req.query.sort = "-ratingsAverage,price";
	req.query.fields = "name,summary,price,ratingsAverage";
	next();
};

// Params Method Middleware
exports.checkID = (req, res, next, val) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return next(
			new ErrorResponse(`Tour with ID of ${req.params.id} is not found`, 404)
		);
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

exports.createTours = HandleAsync(async (req, res, next) => {
	const tour = await Tour.create(req.body);
	res
		.status(201)
		.json({ status: "Success", message: "Tour created successfully", tour });
	// try {
	// 	const tour = await Tour.create(req.body);
	// 	res.status(201).json({
	// 		status: "Success",
	// 		data: {
	// 			tour,
	// 		},
	// 	});
	// } catch (error) {
	// 	const message = error.message.split(": ");
	// 	res.status(400).json({ status: "Failed", message: message[2] });
	// }
});

exports.getTours = HandleAsync(async (req, res) => {
	const features = new APIFeature(Tour.find(), req.query)
		.filter()
		.sort()
		.limitFields()
		.paginate();

	// const tours = await features.query.explain();
	const tours = await features.query;

	res.status(200).json({
		status: "Success",
		results: tours.length,
		data: {
			tours,
		},
	});

	// try {
	// 	// // Filtering
	// 	// // Set the query params to new object
	// 	// const queryObj = { ...req.query };
	// 	// // Set the excluded field that doesnt belong in Tour Model
	// 	// const excludedFields = ["page", "sort", "limit", "fields"];
	// 	// // Loop through excluded field that doesnt macth in Tour Model
	// 	// excludedFields.forEach((field) => delete queryObj[field]);

	// 	// // Advance filtering using operator
	// 	// // Convert JSON format to Object string format
	// 	// let queryString = JSON.stringify(queryObj);
	// 	// queryString = queryString.replace(
	// 	// 	/\b(gte|gt|lte|lt)\b/g,
	// 	// 	(matchedOperator) => `$${matchedOperator}`
	// 	// );

	// 	// // Model.prototype return query
	// 	// let query = Tour.find(JSON.parse(queryString));

	// 	// // Filtering by Sort
	// 	// if (req.query.sort) {
	// 	// 	// Split to array and join them with space
	// 	// 	const sortBy = req.query.sort.split(",").join(" ");
	// 	// 	// Second query criteria is applied/sorted when the first query have the same value
	// 	// 	query = query.sort(sortBy);
	// 	// } else {
	// 	// 	query = query.sort("-createdAt");
	// 	// }

	// 	// // Selecting fields to return in response
	// 	// if (req.query.fields) {
	// 	// 	// Split to array and join them with space
	// 	// 	const selectedFields = req.query.fields.split(",").join(" ");
	// 	// 	// Return response only for the selected fields
	// 	// 	query = query.select(selectedFields);
	// 	// } else {
	// 	// 	query = query.select("-__v");
	// 	// }

	// 	// // Pagination
	// 	// const page = req.query.page * 1 || 1;
	// 	// const limit = req.query.limit * 1 || 100;
	// 	// const skip = (page - 1) * limit;

	// 	// query = query.skip(skip).limit(limit);
	// 	// // Validation to check if the number of page exist
	// 	// if (req.query.page) {
	// 	// 	const numTours = await Tour.countDocuments();
	// 	// 	if (skip >= numTours) throw new Error("Page not found");
	// 	// }

	// 	// Model.prototype.query
	// 	const features = new APIFeature(Tour.find(), req.query)
	// 		.filter()
	// 		.sort()
	// 		.limitFields()
	// 		.paginate();
	// 	const tours = await features.query;

	// 	res.status(200).json({
	// 		status: "Success",
	// 		results: tours.length,
	// 		data: {
	// 			tours,
	// 		},
	// 	});
	// } catch (error) {
	// 	res.status(500).json({ status: error.message });
	// }
});

exports.getTour = HandleAsync(async (req, res) => {
	const tour = await Tour.findById(req.id).populate("reviews");
	res.status(200).json({
		status: "Success",
		data: {
			tour,
		},
	});
	// try {
	// 	const tour = await Tour.findById(req.id);
	// 	res.status(200).json({
	// 		status: "Success",
	// 		data: {
	// 			tour,
	// 		},
	// 	});
	// } catch (error) {
	// 	res.status(404).json({ status: "Failed", message: "Tour not found" });
	// }
});

exports.updateTour = HandleAsync(async (req, res) => {
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
	// try {
	// 	const tour = await Tour.findByIdAndUpdate(req.id, req.body, {
	// 		new: true,
	// 		runValidators: true,
	// 	});
	// 	res.status(200).json({
	// 		status: "Success",
	// 		message: "Tour updated successfully",
	// 		data: {
	// 			tour,
	// 		},
	// 	});
	// } catch (error) {
	// 	const message = error.message.split(": ")[2];
	// 	res.status(400).json({ status: "Failed", message });
	// }
});

exports.deleteTour = HandleAsync(async (req, res) => {
	const tour = await Tour.findByIdAndDelete(req.id);
	res
		.status(204)
		.json({ status: "Success", message: "Tour deleted successfully" });
	// try {
	// 	const tour = await Tour.findByIdAndDelete(req.id);
	// 	res
	// 		.status(204)
	// 		.json({ status: "Success", message: "Tour deleted successfully" });
	// } catch (error) {
	// 	res.status(400).json({ status: "Failed", message: error.message });
	// }
});

exports.getTourStats = HandleAsync(async (req, res) => {
	const stats = await Tour.aggregate([
		{
			// Match every rating with 4.5 reviews
			$match: { ratingsAverage: { $gte: 4.5 } },
		},
		{
			// Group by new field, sum, and loop every single of macthed field
			$group: {
				_id: "$difficulty",
				numTours: { $sum: 1 },
				numRatings: { $sum: "$ratingsQuantity" },
				avgRating: { $avg: "$ratingsAverage" },
				avgPrice: { $avg: "$price" },
				minPrice: { $min: "$price" },
				maxPrice: { $max: "$price" },
			},
		},
		{
			// Sort by ascending average rating
			$sort: {
				avgRating: 1,
			},
		},
		// {
		// 	// Macthed again by the current id is not easy / exclude easy diff
		// 	$match: { _id: { $ne: "easy" } },
		// },
	]);
	res.status(200).json({
		status: "Success",
		message: "Tour stats fetched successfully",
		data: {
			stats,
		},
	});
	// try {
	// 	const stats = await Tour.aggregate([
	// 		{
	// 			// Match every rating with 4.5 reviews
	// 			$match: { ratingsAverage: { $gte: 4.5 } },
	// 		},
	// 		{
	// 			// Group by new field, sum, and loop every single of macthed field
	// 			$group: {
	// 				_id: "$difficulty",
	// 				numTours: { $sum: 1 },
	// 				numRatings: { $sum: "$ratingsQuantity" },
	// 				avgRating: { $avg: "$ratingsAverage" },
	// 				avgPrice: { $avg: "$price" },
	// 				minPrice: { $min: "$price" },
	// 				maxPrice: { $max: "$price" },
	// 			},
	// 		},
	// 		{
	// 			// Sort by ascending average rating
	// 			$sort: {
	// 				avgRating: 1,
	// 			},
	// 		},
	// 		// {
	// 		// 	// Macthed again by the current id is not easy / exclude easy diff
	// 		// 	$match: { _id: { $ne: "easy" } },
	// 		// },
	// 	]);
	// 	res.status(200).json({
	// 		status: "Success",
	// 		message: "Tour stats fetched successfully",
	// 		data: {
	// 			stats,
	// 		},
	// 	});
	// } catch (error) {
	// 	res.status(400).json({ status: "Failed", message: error.message });
	// }
});

exports.getMonthlyPlan = HandleAsync(async (req, res) => {
	const year = req.params.year * 1;
	const plans = await Tour.aggregate([
		{
			$unwind: "$startDates",
		},
		{
			$match: {
				// Dates between 1 January - 31 December
				startDates: {
					$gte: new Date(`${year}-01-01`),
					$lte: new Date(`${year}-12-31`),
				},
			},
		},
		{
			$group: {
				// $month operator to determine number of month
				_id: { $month: "$startDates" },
				numTourResults: { $sum: 1 },
				tours: { $push: "$name" },
			},
		},
		{
			// Add fields to response
			$addFields: {
				month: "$_id",
			},
		},
		{
			// Hide _id response
			$project: {
				_id: 0,
			},
		},
		{
			// Sort by DESC
			$sort: {
				numTourResults: -1,
			},
		},
		{
			$limit: 12,
		},
	]);

	res.status(200).json({
		status: "Success",
		results: plans.length,
		data: {
			plans,
		},
	});
	// try {
	// 	const year = req.params.year * 1;
	// 	const plans = await Tour.aggregate([
	// 		{
	// 			$unwind: "$startDates",
	// 		},
	// 		{
	// 			$match: {
	// 				// Dates between 1 January - 31 December
	// 				startDates: {
	// 					$gte: new Date(`${year}-01-01`),
	// 					$lte: new Date(`${year}-12-31`),
	// 				},
	// 			},
	// 		},
	// 		{
	// 			$group: {
	// 				// $month operator to determine number of month
	// 				_id: { $month: "$startDates" },
	// 				numTourResults: { $sum: 1 },
	// 				tours: { $push: "$name" },
	// 			},
	// 		},
	// 		{
	// 			// Add fields to response
	// 			$addFields: {
	// 				month: "$_id",
	// 			},
	// 		},
	// 		{
	// 			// Hide _id response
	// 			$project: {
	// 				_id: 0,
	// 			},
	// 		},
	// 		{
	// 			// Sort by DESC
	// 			$sort: {
	// 				numTourResults: -1,
	// 			},
	// 		},
	// 		{
	// 			$limit: 12,
	// 		},
	// 	]);

	// 	res.status(200).json({
	// 		status: "Success",
	// 		results: plans.length,
	// 		data: {
	// 			plans,
	// 		},
	// 	});
	// } catch (error) {
	// 	res.status(400).json({ status: "Failed", message: error.message });
	// }
});

// tour-within/233/center/-6.2884439,106.8663284/unit/mil
// tour-within/:distance/center/:latlng/unit/:unit
exports.getToursWithinRadius = HandleAsync(async (req, res, next) => {
	const { distance, latlng, unit } = req.params;
	const [lat, lng] = latlng.split(",");
	const radius = unit === "mil" ? distance / 3963.2 : distance / 6378.1;

	if (!lat || !lng) {
		return next(
			new ErrorResponse(
				"Please specify the lattitude and longitude in order to find tours",
				400
			)
		);
	}

	const tours = await Tour.find({
		startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
	});

	res.status(200).json({
		status: "Success",
		results: tours.length,
		data: {
			data: tours,
		},
	});
});
