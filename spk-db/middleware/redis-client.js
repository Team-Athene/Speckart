// redis-client.js
const redis = require('redis')
const { promisify } = require('util')
const redisPort = process.env.REDIS_PORT || 6379,
	redisHost = process.env.REDIS_HOST || 'localhost',
	redisPassword = process.env.REDIS_PASSWORD,
	client = redis.createClient({
		port: redisPort,
		host: redisHost,
		password: redisPassword,
	})
client.on('connect', function () {
	console.log('Redis Server Connected')
})

module.exports = {
	...client,
	zincrby: promisify(client.zincrby).bind(client),
	zrevrange: promisify(client.zrevrange).bind(client),
	zcard: promisify(client.zcard).bind(client),
	zadd: promisify(client.zadd).bind(client),
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
