const Blog = require("../database/schemas/blog.schema");
const { BlogStateOptions } = require("../util/constant");
const {
	ErrorWithStatus,
} = require("../exceptions/error-with-status.exception");

const createDraft = async (dto) => {
	const newDraft = new Blog({ ...dto });
	await newDraft.save();
	await newDraft.populate("author");
	return newDraft;
};

const getPublishedBlogs = async () => {
	try {
		const publishedPosts = await Blog.find({
			state: BlogStateOptions.published,
		});
		return publishedPosts;
	} catch (error) {
		throw new ErrorWithStatus(error.message, 500);
	}
};
const getPublishedBlogById = async (blogId) => {
	try {
		const publishedPost = await Blog.findOne({
			_id: blogId,
			state: BlogStateOptions.published,
		});

		if (!publishedPost) {
			throw new ErrorWithStatus("Post not found", 404);
		}
		return publishedPost;
	} catch (error) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

const blogService = { createDraft, getPublishedBlogs, getPublishedBlogById };

module.exports = { blogService };
