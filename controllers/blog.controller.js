const { blogService } = require("../services/blog.service");
const {
	WordPerMinute,
	BlogStateOptions,
	orderByOptions,
} = require("../util/constant");
const redisClient = require("../integrations/redis");
const { scanAndDelete } = require("../util/helpers");

const createDraft = async (req, res, next) => {
	const { title, description, tags, body } = req.body;
	const author = req.user.id;
	const wordCount = body.split(" ").length;
	const readingTime = Math.ceil(wordCount / WordPerMinute);

	try {
		const dto = { title, description, author, readingTime, tags, body };
		const newDraft = await blogService.createDraft(dto);
		res.json({
			message: "New draft blog created successfully!",
			data: newDraft,
		});
	} catch (error) {
		next(error);
	}
};

const getPublishedBlogs = async (req, res, next) => {
	let page = Number(req.query.page) || 1;
	page = page < 1 ? 1 : page;

	let limit = Number(req.query.limit) || 20;
	limit = limit < 1 ? 20 : limit;

	let { q } = req.query;
	q = q ? q : null;

	let order = req.query.order || -1;
	order = order ? order : null;

	let orderBy = req.query.orderBy || "createdAt";
	orderBy = orderBy ? orderBy : null;
	orderBy =
		orderBy === orderByOptions.readingTime ||
		orderBy === orderByOptions.readCount ||
		orderBy === orderByOptions.createdAt ||
		orderBy === orderByOptions.updatedAt
			? orderBy
			: null;

	if (order == "asc") {
		order = 1;
	}

	if (order == "desc") {
		order = -1;
	}

	const whereQuery = {};

	if (req.query.q) {
		whereQuery.q = q;
	}
	if (req.query.order) {
		whereQuery.order = order;
	}
	if (req.query.orderBy) {
		whereQuery.orderBy = orderBy;
	}

	const cacheKey = `publishedblogs:${JSON.stringify(
		whereQuery
	)}:${limit}:${page}`;

	// get data from database
	const data = await redisClient.get(cacheKey);

	if (data) {
		console.log(`returning data from cache`);
		return res.json(JSON.parse(data));
	}

	console.log(`returning data from DB`);

	try {
		const { data, meta } = await blogService.getPublishedBlogs(
			page,
			limit,
			whereQuery
		);

		// set cache
		await redisClient.setEx(
			cacheKey,
			600,
			JSON.stringify({ message: `Page ${page} of published posts`, data, meta })
		);

		res.json({ message: `Page ${page} of published posts`, data, meta });
	} catch (error) {
		next(error);
	}
};

const getPublishedBlogById = async (req, res, next) => {
	const { blogId } = req.params;
	try {
		const data = await blogService.getPublishedBlogById(blogId);
		res.status(200).json({ message: "Published post", data });
	} catch (error) {
		next(error);
	}
};

const publishBlog = async (req, res, next) => {
	const { blogId } = req.params;
	const { state } = req.body;
	const pattern = "publishedblogs*";

	await scanAndDelete(pattern);

	try {
		const dto = { state };
		const updatedBlog = await blogService.publishBlog(blogId, dto);
		res.json({
			message: "Blog published successfully",
			data: updatedBlog,
		});
	} catch (error) {
		next(error);
	}
};

const editBlogPost = async (req, res, next) => {
	const { blogId } = req.params;
	const { title, description, tags, body } = req.body;
	const dto = { title, description, tags, body };

	let readingTime;
	let wordCount;

	if (body) {
		wordCount = body.split(" ").length;
	}

	if (wordCount > 0) {
		readingTime = Math.ceil(wordCount / WordPerMinute);
	}

	if (readingTime > 0) {
		dto.readingTime = readingTime;
	}

	try {
		const editedBlogPost = await blogService.editBlogPost(blogId, dto);
		res.json({ message: "Blog post updated", data: editedBlogPost });
	} catch (error) {
		next(error);
	}
};

const deleteBlogPost = async (req, res, next) => {
	const { blogId } = req.params;
	try {
		const deletedBlogPost = await blogService.deleteBlogPost(blogId);
		res.json({ message: "Post deleted successfully", data: deletedBlogPost });
	} catch (error) {
		next(error);
	}
};

const getAuthorBlogPosts = async (req, res, next) => {
	let page = Number(req.query.page) || 1;
	page = page < 1 ? 1 : page;

	let limit = Number(req.query.limit) || 10;
	limit = limit < 1 ? 10 : limit;

	let state = req.query.state || null;
	state = state ? state.toUpperCase() : null;

	const query =
		state === BlogStateOptions.draft || state === BlogStateOptions.published
			? state
			: null;

	const userId = req.user.id;

	try {
		const { data, meta } = await blogService.getAuthorBlogPosts(
			userId,
			page,
			limit,
			query
		);
		res.json({ message: "Author Blog Posts", data, meta });
	} catch (error) {
		next(error);
	}
};

const blogController = {
	createDraft,
	getPublishedBlogs,
	getPublishedBlogById,
	publishBlog,
	editBlogPost,
	deleteBlogPost,
	getAuthorBlogPosts,
};

module.exports = { blogController };
