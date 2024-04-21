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
		throw new ErrorWithStatus(error.message, 500);
	}
};

const getPublishedBlogs = async (page = 1, limit = 20) => {
	const skip = (page - 1) * limit;
	const filter = { state: BlogStateOptions.published };

	try {
		const publishedPosts = await Blog.find(filter).skip(skip).limit(limit);
		const total = await Blog.countDocuments(filter);
		return { data: publishedPosts, meta: { page, limit, total } };
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

const publishBlog = async (blogId, dto) => {
	try {
		const blogPost = await Blog.findById(blogId);
		blogPost.state = dto.state;
		await blogPost.save();
		return blogPost;
	} catch (error) {
		throw new ErrorWithStatus(error.message, 500);
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
		throw new ErrorWithStatus(error.message, 500);
	}
};

const deleteBlogPost = async (blogId) => {
	try {
		const deletedBlogPost = await Blog.findOneAndDelete({ _id: blogId }).select(
			{ createdAt: false, updatedAt: false }
		);

		return deletedBlogPost;
	} catch (error) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

const getAuthorBlogPosts = async (
	userId,
	page = 1,
	limit = 10,
	query = null
) => {
	const skip = (page - 1) * limit;
	const filter = query ? { state: { $regex: query, $options: "i" } } : {};

	try {
		const authorBlogPosts = await Blog.find({ ...filter, author: userId })
			.skip(skip)
			.limit(limit);
		const total = await Blog.countDocuments({ ...filter, author: userId });
		return { data: authorBlogPosts, meta: { page, limit, total } };
	} catch (error) {
		throw new ErrorWithStatus(error.message, 500);
	}
};

const blogService = {
	createDraft,
	getPublishedBlogs,
	getPublishedBlogById,
	publishBlog,
	editBlogPost,
	deleteBlogPost,
	getAuthorBlogPosts,
};

module.exports = { blogService };
