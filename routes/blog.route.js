const { blogController } = require("../controllers/blog.controller");
const authMiddleware = require("../middleware/auth.middleware.js");
const validationMiddleware = require("../middleware/route.middleware");
const isResourceOwner = require("../middleware/resource-owner.middleware.js");
const {
	blogSchema,
	publishBlogSchema,
	updateBlogSchema,
} = require("../validation/blog.validation");
const { Router } = require("express");

const blogRouter = Router();

blogRouter.get("/published", blogController.getPublishedBlogs);

blogRouter.get("/published/:blogId", blogController.getPublishedBlogById);

//log in to access the following routes

blogRouter.use(authMiddleware);

blogRouter.post(
	"/",
	validationMiddleware(blogSchema),
	blogController.createDraft
);

blogRouter.patch(
	"/publish/:blogId",
	isResourceOwner,
	validationMiddleware(publishBlogSchema),
	blogController.publishBlog
);

blogRouter.patch(
	"/edit/:blogId",
	isResourceOwner,
	validationMiddleware(updateBlogSchema),
	blogController.editBlogPost
);

blogRouter.delete("/:blogId", isResourceOwner, blogController.deleteBlogPost);

blogRouter.get("/myblogposts", blogController.getAuthorBlogPosts);

module.exports = blogRouter;
