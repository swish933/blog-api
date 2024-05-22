const redisClient = require("../integrations/redis");

const scanAndDelete = async (pattern, count = 100) => {
	const iteratorConfig = {
		MATCH: pattern,
		COUNT: count,
	};

	for await (const key of redisClient.scanIterator(iteratorConfig)) {
		await redisClient.del(key);
	}
};

module.exports = { scanAndDelete };
