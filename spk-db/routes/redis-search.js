const redis = require('redis'),                 
{ promisify } = require('util'),                         
    rediSearch  = require('../lib/redis-search'),                                       
    client = rediSearch(redis,'Products',{ clientOptions : process.env.REDIS_URL });  
    module.exports = {
        ...client,
        getDoc: promisify(client.getDoc).bind(client),
        search: promisify(client.search).bind(client),
        add: promisify(client.add).bind(client),
        createIndex: promisify(client.createIndex).bind(client),
        dropIndex: promisify(client.dropIndex).bind(client),
        batch: promisify(client.batch).bind(client),
    }