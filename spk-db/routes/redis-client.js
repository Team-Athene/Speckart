// redis-client.js
const redis = require('redis');
const {promisify} = require('util');
const client = redis.createClient(process.env.REDIS_URL);
client.on('connect', function () {
    console.log('Redis Server Connected');
})

module.exports = {
  ...client,
  getAsync: promisify(client.get).bind(client),
  setAsync: promisify(client.set).bind(client),
  keysAsync: promisify(client.keys).bind(client)
};