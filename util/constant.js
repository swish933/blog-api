const BlogStateOptions = {
	draft: "DRAFT",
	published: "PUBLISHED",
};

const WordPerMinute = 250;

const orderByOptions = {
	readingTime: "readingTime",
	readCount: "readCount",
	createdAt: "createdAt",
	updatedAt: "updatedAt",
};

module.exports = { BlogStateOptions, WordPerMinute, orderByOptions };
