const express = require("express");
const {
	createUser,
	getUsers,
	deleteUser,
	updateUser,
	getUser,
} = require("../controllers/UserController");
const protectRoute = require("../middlewares/protectRoute");
const restrictTo = require("../middlewares/RestrictTo");
const userRouter = express.Router();

// Protect all routes after this middleware
userRouter.use(protectRoute);

userRouter.route("/").post(createUser).get(getUsers);

userRouter.use(restrictTo("admin"));

userRouter.route("/:id").get(getUser).delete(deleteUser).patch(updateUser);

module.exports = userRouter;
