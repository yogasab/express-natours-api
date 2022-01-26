const bcryptjs = require("bcryptjs");
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
		select: false,
	},
	passwordConfirmation: {
		type: String,
		required: [true, "Please fill the password confirmation field"],
		validate: {
			validator: function (passwordConfirmation) {
				return passwordConfirmation === this.password;
			},
			message: "Your password confirmation is not match. Please check again",
		},
	},
});

// Pre save middleware before save into User Model
UserSchema.pre("save", async function (next) {
	// Only run this function if password was actually modified
	if (!this.isModified("password")) return next();
	// Hash the password with salt of 12
	this.password = await bcryptjs.hash(this.password, 12);
	// Set passwordConfirmation to undefined, because its only need in field form to validate password
	this.passwordConfirmation = undefined;

	next();
});

// Methods to compare the entered hashed password
UserSchema.methods.comparePassword = async function (
	enteredPassword,
	password
) {
	return await bcryptjs.compare(enteredPassword, password);
};

module.exports = mongoose.model("User", UserSchema);
