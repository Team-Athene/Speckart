// redis-client.js
const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
client.on('connect', function () {
    console.log('Redis Server Connected');
})

module.exports = {
  ...client,
  lrange: promisify(client.lrange).bind(client),
  rpush: promisify(client.rpush).bind(client),
  get: promisify(client.get).bind(client),
  set: promisify(client.set).bind(client),
  keys: promisify(client.keys).bind(client)
};