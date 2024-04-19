const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
		userName: {
			type: String,
			unique: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			lowercase: true,
			trim: true,
		},
		password: {
			type: String,
			trim: true,
		},
	},
	{ timestamps: true }
);

UserSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		delete ret["password"];
		return ret;
	},
});

const User = model("User", UserSchema);

module.exports = User;
