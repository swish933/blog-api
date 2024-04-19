const Blog = require("../database/schemas/blog.schema");

const createDraft = async (dto) => {
	const newDraft = new Blog({ ...dto });
	await newDraft.save();
	await newDraft.populate("author");
	return newDraft;
};

const blogService = { createDraft };

module.exports = { blogService };
