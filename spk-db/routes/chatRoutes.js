const express = require('express'),
	chatRouter = express.Router(),
	client = require('../lib/redis'),
	{
		fetchMessages,
		fetchActiveUsers,
		addMessage,
		addActiveUser,
		removeActiveUser,
	} = require('../lib/functions')
let fetchMessage = (room) => {
	return fetchMessages(room).then(
		(res) => {
			return res
		},
		(err) => {
			console.log(err)
		}
	)
}
let fetchUsers = (room) => {
	return fetchActiveUsers(room).then(
		(res) => {
			return res
		},
		(err) => {
			console.log(err)
		}
	)
}
const router = () => {
	chatRouter.get('/messages', (req, res) => {
		const { room } = req.query
		fetchMessage(room).then((messages) => {
			res.send(messages)
		})
	})
	chatRouter.get('/users', (req, res) => {
		const { room } = req.query
		fetchUsers(room).then((u) => {
			res.send(u)
		})
	})
	chatRouter.post('/user', (req, res) => {
		let users
		let { user, room } = req.body
		fetchUsers(room).then((u) => {
			users = u
			if (users.indexOf(user) === -1) {
				addActiveUser(room, user).then(
					() => {
						client().then(
							(client) => {
								let msg = {
									message: req.body.user + ' just joined the chat room',
									user: 'system',
									room,
								}
								client.publish('chatMessages', JSON.stringify(msg))
								client.publish('activeUsers', JSON.stringify(fetchUsers(room)))
								addMessage(room, JSON.stringify(msg)).then(
									() => {
										res.send({
											status: 200,
											message: 'User joined',
										})
									},
									(err) => {
										console.log(err)
									}
								)
							},
							(err) => {
								console.log(err)
							}
						)
					},
					(err) => {
						console.log(err)
					}
				)
			} else {
				res.send({ status: 403, message: 'User already exist' })
			}
		})
	})
	chatRouter.post('/deleteUser', async (req, res) => {
		let users
		let { user, room } = req.body
		console.log('Log: user', user)
		fetchUsers(room).then(async (u) => {
			users = u
			if (users.indexOf(user) !== -1) {
				removeActiveUser(room, user).then(
					() => {
						client().then(
							(client) => {
								let msg = {
									message: req.body.user + ' just left the chat room',
									user: 'system',
									room,
								}
								client.publish('chatMessages', JSON.stringify(msg))
								client.publish('activeUsers', JSON.stringify(fetchUsers(room)))
								addMessage(room, JSON.stringify(msg)).then(
									() => {
										res.send({
											status: 200,
											message: 'User removed',
										})
									},
									(err) => {
										console.log(err)
									}
								)
							},
							(err) => {
								console.log(err)
							}
						)
					},
					(err) => {
						console.log(err)
					}
				)
			} else {
				res.send({ status: 403, message: 'User does not exist' })
			}
		})
	})
	chatRouter.post('/message', (req, res) => {
		const { room } = req.body
		let msg = {
			message: req.body.msg,
			user: req.body.user,
			room,
		}
		client().then(
			(client) => {
				client.publish('chatMessages', JSON.stringify(msg))
				addMessage(room, JSON.stringify(msg)).then(
					() => {
						res.send({
							status: 200,
							message: 'Message sent',
						})
					},
					(err) => {
						console.log(err)
					}
				)
			},
			(err) => {
				console.log(err)
			}
		)
	})
	return chatRouter
}
module.exports = router
