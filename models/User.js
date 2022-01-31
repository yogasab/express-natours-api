const crypto = require("crypto");
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
	role: {
		type: String,
		enum: ["admin", "user", "guide", "lead-guide"],
		default: "user",
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
	passwordChangedAt: Date,
	resetPasswordToken: String,
	resetPasswordTokenExpired: Date,
	// Soft Delete user
	active: {
		type: Boolean,
		default: true,
		select: false,
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

// Pre save middleware before save into User Model while update password functionality
UserSchema.pre("save", function (next) {
	// Only run this function if password was actually modified or newly created
	if (!this.isModified("password") || this.isNew) return next();
	// Set the passwordChangedAt
	this.passwordChangedAt = Date.now() - 1000;
	next();
});

// Query Middleware to find user where is not active / soft delete
UserSchema.pre(/^find/, function (next) {
	this.find({ active: { $ne: false } });
	next();
});

// Methods to compare the entered hashed password
UserSchema.methods.comparePassword = async function (
	enteredPassword,
	password
) {
	return await bcryptjs.compare(enteredPassword, password);
};

// Method to compare the date if the password is changed
UserSchema.methods.changedPasswordAfter = function (JWTTimeStamp) {
	if (this.passwordChangedAt) {
		const changedTimestamp = parseInt(
			this.passwordChangedAt.getTime() / 1000,
			10
		);
		return JWTTimeStamp < changedTimestamp; // 100 < 200
	}
	return false;
};

// Method to create reset password token
UserSchema.methods.createResetPasswordToken = function () {
	// Create random cryto string then convert to string
	const resetToken = crypto.randomBytes(32).toString("hex");
	// Set to resetPasswordToken field
	this.resetPasswordToken = crypto
		.createHash("sha256")
		.update(resetToken)
		.digest("hex");
	console.log(
		{ resetToken },
		{ resetPasswordTokenHashed: this.resetPasswordToken }
	);
	// Set to resetPasswordTokenExpired field to 10 minutes
	this.resetPasswordTokenExpired = Date.now() + 10 * 60 * 1000;

	return resetToken;
};

module.exports = mongoose.model("User", UserSchema);
