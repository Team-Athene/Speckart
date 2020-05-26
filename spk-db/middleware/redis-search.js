const redis = require('redis'),
	bluebird = require('bluebird'),
	{ promisify } = require('util'),
	rediSearch = require('../lib/redis-search'),
	client = rediSearch(redis, 'Products', {
		clientOptions: process.env.REDIS_URL,
	})
module.exports = {
	...client,
	getDoc: bluebird.promisifyAll(client.getDoc).bind(client),
	search: bluebird.promisify(client.search).bind(client),
	add: promisify(client.add).bind(client),
	createIndex: promisify(client.createIndex).bind(client),
	dropIndex: promisify(client.dropIndex).bind(client),
	batch: promisify(client.batch).bind(client),
}
