const HandleAsync = require("../../utils/HandleAsync");
const Tour = require("../../models/Tour");

exports.getTour = HandleAsync(async (req, res) => {
	const { slug } = req.params;

	const tour = await Tour.findOne({ slug }).populate({
		path: "reviews",
		fields: "review rating user",
	});

	res.status(200).render("tour", {
		title: `${tour.name}`,
		tour,
	});
});
