const Tour = require("../../models/Tour");
const HandleAsync = require("../../utils/HandleAsync");

exports.getOverview = HandleAsync(async (req, res) => {
	const tours = await Tour.find();

	res.status(200).render("overview", {
		title: "All Tours",
		tours,
	});
});
