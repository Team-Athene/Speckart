const client = require('../lib/redis')

const fetchMessages = (room) => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res.lrangeAsync(`${room}_messages`, 0, -1).then(
					(messages) => {
						resolve(messages)
					},
					(err) => {
						reject(err)
					}
				)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}
const addMessage = (room, message) => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res
					.multi()
					.rpush(`${room}_messages`, message)
					.execAsync()
					.then(
						(res) => {
							resolve(res)
						},
						(err) => {
							reject(err)
						}
					)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}

const fetchActiveUsers = (room) => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res.smembersAsync(`${room}_users`).then(
					(users) => {
						resolve(users)
					},
					(err) => {
						reject(err)
					}
				)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}

const addActiveUser = (room, user) => {
	return new Promise((resolve, reject) => {
		client().then(
			(res) => {
				res
					.multi()
					.sadd(`${room}_users`, user)
					.execAsync()
					.then(
						(res) => {
							if (res[0] === 1) {
								resolve('User added')
							}

							reject('User already in list')
						},
						(err) => {
							reject(err)
						}
					)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}

const removeActiveUser = (room, user) => {
	return new Promise(async (resolve, reject) => {
		client().then(
			(res) => {
				res
					.multi()
					.srem(`${room}_users`, user)
					.execAsync()
					.then(
						(res) => {
							if (res[0] === 1) {
								resolve('User removed')
							}
							reject('User is not in list')
						},
						(err) => {
							reject(err)
						}
					)
			},
			(err) => {
				reject('Redis connection failed: ' + err)
			}
		)
	})
}
module.exports = {
	fetchActiveUsers,
	addActiveUser,
	removeActiveUser,
	addMessage,
	fetchMessages,
}
