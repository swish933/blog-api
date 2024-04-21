const { blogService } = require("../services/blog.service");
const { WordPerMinute, BlogStateOptions } = require("../util/constant");

const createDraft = async (req, res) => {
	const { title, description, tags, body } = req.body;
	const author = req.user.id;
	const wordCount = body.split(" ").length;
	const readingTime = Math.ceil(wordCount / WordPerMinute);
	try {
		const dto = { title, description, author, readingTime, tags, body };
		const newDraft = await blogService.createBlog(dto);
		res.json({
			message: "New draft blog created successfully!",
			data: newDraft,
		});
	} catch (error) {
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
	}
};

const getPublishedBlogs = async (req, res) => {
	let page = Number(req.query.page) || 1;
	page = page < 1 ? 1 : page;

	let limit = Number(req.query.limit) || 20;
	limit = limit < 1 ? 20 : limit;

	let { q } = req.query;
	q = q ? q : null;

	try {
		const { data, meta } = await blogService.getPublishedBlogs(page, limit, q);
		res.json({ message: `Page ${page} of published posts`, data, meta });
	} catch (error) {
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
	}
};

const getPublishedBlogById = async (req, res) => {
	const { blogId } = req.params;
	try {
		const data = await blogService.getPublishedBlogById(blogId);
		res.status(200).json({ message: "Published post", data });
	} catch (error) {
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
	}
};

const publishBlog = async (req, res) => {
	const { blogId } = req.params;
	const { state } = req.body;
	try {
		const dto = { state };
		const updatedBlog = await blogService.publishBlog(blogId, dto);
		res.json({
			message: "Blog published successfully",
			data: updatedBlog,
		});
	} catch (error) {
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
	}
};

const editBlogPost = async (req, res) => {
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
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
	}
};

const deleteBlogPost = async (req, res) => {
	const { blogId } = req.params;
	try {
		const deletedBlogPost = await blogService.deleteBlogPost(blogId);
		res.json({ message: "Post deleted successfully", data: deletedBlogPost });
	} catch (error) {
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
	}
};

const getAuthorBlogPosts = async (req, res) => {
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
		console.log(error);
		res.status(error.status || 500);
		res.json({ message: error.message });
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
