const express = require("express");
const {
	createUser,
	getUsers,
	deleteUser,
	updateUser,
} = require("../controllers/UserController");
const protectRoute = require("../middlewares/protectRoute");
const restrictTo = require("../middlewares/RestrictTo");
const userRouter = express.Router();

userRouter.route("/").post(createUser).get(getUsers);
userRouter
	.route("/:id")
	.delete(protectRoute, restrictTo("admin"), deleteUser)
	.patch(protectRoute, restrictTo("admin"), updateUser);

module.exports = userRouter;
