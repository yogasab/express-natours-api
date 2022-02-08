exports.getTour = (req, res) => {
	res.status(200).render("tour", {
		title: "The Forest Hiker Tour Detail",
	});
};
