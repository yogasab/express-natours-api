class APIFeature {
	constructor(query, requestQuery) {
		this.query = query;
		this.requestQuery = requestQuery;
	}

	filter() {
		// Filtering
		// Set the query params to new object
		const queryObj = { ...this.requestQuery };
		// Set the excluded field that doesnt belong in Tour Model
		const excludedFields = ["page", "sort", "limit", "fields"];
		// Loop through excluded field that doesnt macth in Tour Model
		excludedFields.forEach((field) => delete queryObj[field]);

		// Advance filtering using operator
		// Convert JSON format to Object string format
		let queryString = JSON.stringify(queryObj);
		queryString = queryString.replace(
			/\b(gte|gt|lte|lt)\b/g,
			(matchedOperator) => `$${matchedOperator}`
		);
		// Model.prototype return query
		this.query = this.query.find(JSON.parse(queryString));

		return this;
	}

	sort() {
		// Filtering by Sort
		if (this.requestQuery.sort) {
			// Split to array and join them with space
			const sortBy = this.requestQuery.sort.split(",").join(" ");
			// Second query criteria is applied/sorted when the first query have the same value
			this.query = this.query.sort(sortBy);
		} else {
			this.query = this.query.sort("-createdAt");
		}

		return this;
	}

	limitFields() {
		// Selecting fields to return in response
		if (this.requestQuery.fields) {
			// Split to array and join them with space
			const selectedFields = this.requestQuery.fields.split(",").join(" ");
			// Return response only for the selected fields
			this.query = this.query.select(selectedFields);
		} else {
			this.query = this.query.select("-__v");
		}

		return this;
	}

	paginate() {
		// Pagination
		const page = this.requestQuery.page * 1 || 1;
		const limit = this.requestQuery.limit * 1 || 100;
		const skip = (page - 1) * limit;

		this.query = this.query.skip(skip).limit(limit);
		// Validation to check if the number of page exist
		// if (req.query.page) {
		// 	const numTours = await Tour.countDocuments();
		// 	if (skip >= numTours) throw new Error("Page not found");
		// }

		return this;
	}
}

module.exports = APIFeature;
