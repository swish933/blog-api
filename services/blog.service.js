const Blog = require("../database/schemas/blog.schema");
const { BlogStateOptions } = require("../util/constant");
const {
	ErrorWithStatus,
} = require("../exceptions/error-with-status.exception");

const createDraft = async (dto) => {
	try {
		const newDraft = new Blog({ ...dto });
		await newDraft.save();
		await newDraft.populate("author");
		return newDraft;
	} catch (error) {
		throw new Error(error.message);
	}
};

const getPublishedBlogs = async () => {
	try {
		const publishedPosts = await Blog.find({
			state: BlogStateOptions.published,
		});
		return publishedPosts;
	} catch (error) {
		throw new Error(error.message);
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
		throw new Error(error.message);
	}
};

const publishBlog = async (blogId, dto) => {
	try {
		const blogPost = await Blog.findById(blogId);
		blogPost.state = dto.state;
		await blogPost.save();
		return blogPost;
	} catch (error) {
		throw new Error(error.message);
	}
};

const editBlogPost = async (blogId, dto) => {
	try {
		const blogPost = Blog.findOneAndUpdate(
			{ _id: blogId },
			{ ...dto },
			{ new: true }
		);

		return blogPost;
	} catch (error) {
		throw new Error(error.message);
	}
};

const deleteBlogPost = async (blogId) => {
	try {
		const deletedBlogPost = await Blog.findOneAndDelete({ _id: blogId }).select(
			{ createdAt: false, updatedAt: false }
		);

		return deletedBlogPost;
	} catch (error) {
		throw new Error(error.message);
	}
};

const blogService = {
	createDraft,
	getPublishedBlogs,
	getPublishedBlogById,
	publishBlog,
	editBlogPost,
	deleteBlogPost,
};

module.exports = { blogService };
