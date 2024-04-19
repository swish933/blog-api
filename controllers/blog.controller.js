const { blogService } = require("../services/blog.service");
const { WordPerMinute } = require("../util/constant");

const create = async (req, res) => {
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

const blogController = { create };

module.exports = { blogController };
//  title is required and unique
//  description
//  author
//  state
//  read_count
//  reading_time
//  tags
//  body is required
//  timestamp
