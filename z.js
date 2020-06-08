/**
 *Redis sending new message from a particular room 
 using RPUSH key Command.
 MULTI is used queued for atomic execution
 EXEC is executes all previously queued commands
 functions.js Line no: 25
 */
res.multi().rpush(`${room}_messages`, message).execAsync()

/**
  *Redis Publishing 'activeUsers'
 It is called while fetching the active users in chatRoutes.js
 */
client.publish('activeUsers', JSON.stringify(fetchUsers(room)))

/**
 *Redis fetching message for a particular room 
 using LRANGE key Command.
 functions.js Line no: 7
 */
res.lrangeAsync(`${room}_messages`, 0, -1)
/**
 *Redis fetching active users for a particular room 
 using SMEMBERS key Command.
 functions.js Line no: 50
 */
res.smembersAsync(`${room}_users`)
/**
 *Redis adding new active users for a particular room 
 using SADD key Command.
 MULTI is used queued for atomic execution
 EXEC is executes all previously queued commands
 functions.js Line no: 70
 */
res.multi().sadd(`${room}_users`, user).execAsync()
/**
 *Redis removing an active user for a particular room 
 using SREM key Command.
 MULTI is used queued for atomic execution
 EXEC is executes all previously queued commands
 functions.js Line no: 98
 */
res.multi().srem(`${room}_users`, user).execAsync()
/** 
 *Adding fields using Redisearch Modules when 
 a product is added
 adminRoutes.js : Lines 35-65
*/
client.createIndex([
    client.fieldDefinition.numeric('itemId', true),
    client.fieldDefinition.text('itemName', true),
    client.fieldDefinition.text('itemType', true),
    client.fieldDefinition.numeric('itemPrice', true),
    client.fieldDefinition.text('itemDetails', true),
    client.fieldDefinition.text('itemBrand', true),
    client.fieldDefinition.text('itemColor', true),
  ],function (error, val) {})
client.add(itemId,{
    itemId: itemId,
    itemName: itemName,
    itemType: itemType,
    itemPrice: itemPrice,
    itemDetails: itemDetails,
    itemBrand: itemBrand,
    itemColor: itemColor,
  }, function (error, val) {})
  /**
   *Item Brands are added as a list to Redis to view the 
   item brand list added to the platform
    adminRoutes.js : Lines:66-67
   */
  await redisClient.lrem('itemBrand', 0, itemBrand.toUpperCase())
  await redisClient.lpush('itemBrand', itemBrand.toUpperCase())
  /**
   *Initialise the item count of each product with 
   respect to the item count as 0
    adminRoutes.js : Line 68
   */
  await redisClient.zadd('itemCount', 0, itemId)