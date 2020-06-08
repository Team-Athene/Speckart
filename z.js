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
 its called while fetching the active users in chatRoutes.js
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
 *Redis removing a active user for a particular room 
 using SREM key Command.
 MULTI is used queued for atomic execution
 EXEC is executes all previously queued commands
 functions.js Line no: 98
 */
res.multi().srem(`${room}_users`, user).execAsync()
