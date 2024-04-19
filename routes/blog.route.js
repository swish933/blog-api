const { blogController } = require("../controllers/blog.controller");
const authMiddleware = require("../middleware/auth.middleware.js");
const validationMiddleware = require("../middleware/route.middleware");
const { blogSchema } = require("../validation/blog.validation");
const { Router } = require("express");

const blogRouter = Router();

blogRouter.get("/published", blogController.getPublishedBlogs);

blogRouter.get("/published/:blogId", blogController.getPublishedBlogById);

blogRouter.use(authMiddleware);

blogRouter.post(
	"/",
	validationMiddleware(blogSchema),
	blogController.createDraft
);

module.exports = blogRouter;
