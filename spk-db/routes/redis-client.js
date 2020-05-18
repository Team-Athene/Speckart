// redis-client.js
const redis = require('redis')
const { promisify } = require('util')
const client = redis.createClient(process.env.REDIS_URL)
console.log('Log: process.env.REDIS_URL', process.env.REDIS_URL)
// const redisearch = require('redis-redisearch')
// redisearch(redis)

client.on('connect', function () {
	console.log('Redis Server Connected')
})

module.exports = {
	...client,
	del: promisify(client.del).bind(client),
	llen: promisify(client.llen).bind(client),
	lrem: promisify(client.lrem).bind(client),
	ltrim: promisify(client.ltrim).bind(client),
	lrange: promisify(client.lrange).bind(client),
	lpop: promisify(client.lpop).bind(client),
	rpush: promisify(client.rpush).bind(client),
	lpush: promisify(client.lpush).bind(client),
	get: promisify(client.get).bind(client),
	set: promisify(client.set).bind(client),
	keys: promisify(client.keys).bind(client),
}
