const redisClient = require("../integrations/redis");

const scanAndDelete = async (pattern, count = 100) => {
	let cursor = 0;
	let found = [];
	console.log(pattern);
	do {
		const reply = await redisClient.scan(cursor, {
			MATCH: pattern,
			COUNT: count,
		});

		cursor = reply.cursor;
		found = [...reply.keys];
	} while (cursor !== 0);

	console.log(found);

	for (const key of found) {
		await redisClient.del(key);
	}
};

module.exports = { scanAndDelete };
