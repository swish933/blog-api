const Blog = require("../database/schemas/blog.schema");

const createBlog = async (dto) => {
	const newDraft = new Blog({ ...dto });
	await newDraft.save();
	await newDraft.populate("author");
	return newDraft;
};

const blogService = { createBlog };

module.exports = { blogService };
