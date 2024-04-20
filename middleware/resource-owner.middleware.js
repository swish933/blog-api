const Blog = require("../database/schemas/blog.schema");

const isResourceOwner = async (req, res, next) => {
	const { blogId } = req.params;
	const userId = req.user.id;
	try {
		const resource = await Blog.findById(blogId);

		if (!resource) {
			return res.status(404).json({ message: "Resource not found" });
		}

		if (resource.author.toString() !== userId) {
			return res
				.status(403)
				.json({ message: "You are not authorized to perform this action" });
		}
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Internal Server Error" });
	}
};

module.exports = isResourceOwner;
