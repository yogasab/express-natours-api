const express = require("express");
const {
	signUp,
	signIn,
	forgotPassword,
	resetPassword,
} = require("../controllers/AuthController");
const authRouter = express.Router();

authRouter.post("/signup", signUp);
authRouter.post("/signin", signIn);

authRouter.post("/forgot-password", forgotPassword);
authRouter.patch("/reset-password/:token", resetPassword);

module.exports = authRouter;
