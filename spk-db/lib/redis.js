const redis = require('redis')
const promise = require('bluebird')
const REDIS_URL = process.env.REDIS_URL

promise.promisifyAll(redis.RedisClient.prototype)
promise.promisifyAll(redis.Multi.prototype)

const client = () => {
	return new Promise((resolve, reject) => {
		let connector = redis.createClient(REDIS_URL)
		connector.on('error', () => {
			reject('Redis Connection failed')
		})
		connector.on('connect', () => {
			resolve(connector)
		})
	})
}
module.exports = client
