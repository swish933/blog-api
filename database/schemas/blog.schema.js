const { Schema, model } = require("mongoose");
const { BlogStateOptions } = require("../../util/constant");

const BlogSchema = new Schema(
	{
		title: {
			type: String,
			trim: true,
			required: true,
			unique: true,
		},
		description: {
			type: String,
			trim: true,
		},
		author: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		state: {
			type: String,
			enum: [BlogStateOptions.draft, BlogStateOptions.published],
			default: BlogStateOptions.draft,
		},
		readCount: {
			type: Number,
			min: 0,
			default: 0,
		},
		readingTime: {
			type: Number,
			min: 0,
		},
		tags: {
			type: [String],
			trim: true,
		},
		body: {
			type: String,
			required: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

BlogSchema.set("toJSON", {
	virtuals: true,
	versionKey: false,
	transform: function (doc, ret) {
		delete ret._id;
		return ret;
	},
});

const Blog = model("Blog", BlogSchema);

module.exports = Blog;
