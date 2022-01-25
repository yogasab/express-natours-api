const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema({
	name: {
		type: String,
		required: [true, "Please fill the name field"],
	},
	email: {
		type: String,
		required: [true, "Please fill the email field"],
		unique: [true, "The current email has already registered"],
		lowercase: true,
		validated: [validator.isEmail, "Please a provide valid email format"],
	},
	photo: {
		type: String,
	},
	password: {
		type: String,
		required: [true, "Please fill the password field"],
		minlength: 8,
	},
	passwordConfirmation: {
		type: String,
		required: [true, "Please fill the password confirmation field"],
	},
});

module.exports = mongoose.model("User", UserSchema);
