const express = require("express");
const { signUp } = require("../controllers/AuthController");
const authRouter = express.Router();

authRouter.post("/signup", signUp);

module.exports = authRouter;
