const setUserAndTourID = (req, res, next) => {
	// Nested Routes
	if (!req.body.tour) req.body.tour = req.params.tourId;
	if (!req.body.user) req.body.user = req.user.id;
	next();
};

module.exports = setUserAndTourID;
