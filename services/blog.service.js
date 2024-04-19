const Blog = require("../database/schemas/blog.schema");
const { BlogStateOptions } = require("../util/constant");

const createDraft = async (dto) => {
	const newDraft = new Blog({ ...dto });
	await newDraft.save();
	await newDraft.populate("author");
	return newDraft;
};

const getPublishedPosts = async () => {
	try {
		const publishedPosts = await Blog.find({
			state: BlogStateOptions.published,
		});
		return publishedPosts;
	} catch (error) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

const blogService = { createDraft, getPublishedPosts };

module.exports = { blogService };
