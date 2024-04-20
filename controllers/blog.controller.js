const { blogService } = require("../services/blog.service");
const { WordPerMinute } = require("../util/constant");

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

const getPublishedBlogs = async (_, res) => {
	try {
		const data = await blogService.getPublishedBlogs();
		res.status(200).json({ message: "All published posts", data });
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

const blogController = {
	createDraft,
	getPublishedBlogs,
	getPublishedBlogById,
	publishBlog,
	editBlogPost,
	deleteBlogPost,
};

module.exports = { blogController };
