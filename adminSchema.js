const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const adminSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		minlength: 5,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
	},
});
adminSchema.pre("save", function (next) {
	let self = this;
	bcrypt.hash(self.password, 10, function (error, hashedPassword) {
		if (error) {
			console.log("hashed fail");
			return next(error);
		}
		console.log("hash sucesfuli set");
		self.password = hashedPassword;
		next();
	});
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = mongoose.model("Admin", adminSchema);
