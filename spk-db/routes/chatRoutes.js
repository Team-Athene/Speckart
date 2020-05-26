const express = require('express'),
	chatRouter = express.Router(),
	{ client } = require('../lib/redis'),
	{
		fetchMessages,
		fetchActiveUsers,
		addMessage,
		addActiveUser,
		removeActiveUser,
	} = require('../lib/functions')
let fetchMessage = () => {
	return fetchMessages().then(
		(res) => {
			return res
		},
		(err) => {
			console.log(err)
		}
	)
}
let fetchUsers = () => {
	return fetchActiveUsers().then(
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
		console.log('Log: req.params', req.params)
		console.log('Log: req.query', req.query)
		fetchMessage().then((messages) => {
			res.send(messages)
		})
	})
	chatRouter.get('/users', (req, res) => {
		fetchUsers().then((u) => {
			res.send(u)
		})
	})
	chatRouter.post('/user', (req, res) => {
		let users
		let { user } = req.body
		console.log('Log: user', user)
		fetchUsers().then((u) => {
			users = u
			if (users.indexOf(user) === -1) {
				addActiveUser(user).then(
					() => {
						client().then(
							(client) => {
								let msg = {
									message: req.body.user + ' just joined the chat room',
									user: 'system',
								}
								client.publish('chatMessages', JSON.stringify(msg))
								client.publish('activeUsers', JSON.stringify(fetchUsers()))

								addMessage(JSON.stringify(msg)).then(
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
		let user = req.body.user
		console.log('Log: user', user)
		fetchUsers().then(async (u) => {
			users = u
			if (users.indexOf(user) !== -1) {
				console.log('Log: users]]================', users.indexOf(user))
				console.log('Log: users]]================', users.includes(user))
				console.log('Log: users', users)
				removeActiveUser(user).then(
					() => {
						client().then(
							(client) => {
								let msg = {
									message: req.body.user + ' just left the chat room',
									user: 'system',
								}
								client.publish('chatMessages', JSON.stringify(msg))
								client.publish('activeUsers', JSON.stringify(fetchUsers()))
								addMessage(JSON.stringify(msg)).then(
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
		let msg = {
			message: req.body.msg,
			user: req.body.user,
		}
		client().then(
			(client) => {
				client.publish('chatMessages', JSON.stringify(msg))
				addMessage(JSON.stringify(msg)).then(
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
