const express = require("express");
const { createUser, getUsers } = require("../controllers/UserController");
const userRouter = express.Router();

userRouter.route("/").post(createUser).get(getUsers);

module.exports = userRouter;
