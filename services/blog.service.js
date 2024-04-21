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

const getPublishedBlogs = async (
	page = 1,
	limit = 20,
	query = null,
	order = -1,
	orderBy = "createdAt"
) => {
	const skip = (page - 1) * limit;
	const filter = { state: BlogStateOptions.published };

	const aggregationPipeline = [
		{
			$lookup: {
				from: "users",
				localField: "author",
				foreignField: "_id",
				as: "author",
			},
		},
		{ $unwind: "$author" },
		{
			$match: {
				$and: [
					{ state: BlogStateOptions.published },
					{
						$or: [
							{ title: { $regex: query, $options: "i" } },
							{ tags: { $regex: query, $options: "i" } },
							{ "author.firstName": { $regex: query, $options: "i" } },
							{ "author.lastName": { $regex: query, $options: "i" } },
						],
					},
				],
			},
		},
		{ $unset: ["author.password", "author.createdAt", "author.updatedAt"] },
		{ $sort: { [`${orderBy}`]: order } },
	];

	try {
		if (!query) {
			const publishedPosts = await Blog.find({ ...filter })
				.skip(skip)
				.limit(limit)
				.sort({
					[orderBy]: order,
				});
			const total = await Blog.countDocuments({ ...filter });
			return { data: publishedPosts, meta: { page, limit, total } };
		} else {
			const publishedPosts = await Blog.aggregate(aggregationPipeline)
				.skip(skip)
				.limit(limit);

			const total = await Blog.aggregate([
				...aggregationPipeline,
				{
					$count: "totalDocs",
				},
			]);

			const [doc] = total;
			return {
				data: publishedPosts,
				meta: { page, limit, total: doc.totalDocs },
			};
		}
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

		// await publishedPost.populate({
		// 	path: "authors",
		// 	select: { password: false, createdAt: false, updatedAt: false },
		// });

		publishedPost.readCount += 1;
		await publishedPost.save();
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
