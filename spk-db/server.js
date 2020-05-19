'use strict'

import express from 'express'
import bodyParser from 'body-parser'
import socket from 'socket.io'
import path from 'path'
import { client } from '../lib/redis'
import * as routes from './routes'

const PORT = 3000

const app = express()

// view engine setup
app.set('view engine', 'ejs')
app.use(express.static('./public'))
app.options('/*', (req, res) => {
	res.header('Access-Control-Allow-Origin', '*')
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
	res.header(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization, Content-Length, X-Requested-With'
	)
	res.sendStatus(200)
})
app.use(bodyParser.json())
app.use('/img', express.static(path.join(__dirname, 'public/uploads')))

// Middleware to parse request body
app.use(
	bodyParser.urlencoded({
		extended: true,
	})
)

client().then(
	(res) => {
		// subscribe to Pub/Sub channels
		res.subscribe('chatMessages')
		res.subscribe('activeUsers')

		// App routes
		app.use('/', require('./routes/api'))
		// app.get('/', routes.home)
		// app.get('/chat/:username', routes.chatRoom)
		// app.get('/messages', routes.messages)
		// app.get('/users', routes.users)
		// app.post('/user', routes.createUser)
		// app.delete('/user', routes.deleteUser)
		// app.post('/message', routes.createMessage)

		//Start the server
		const server = app.listen(PORT, () => {
			console.log('Server Started')
		})

		const io = socket.listen(server)

		//listen and emit messages and user events (leave or join) using socket.io
		io.on('connection', (socket) => {
			res.on('message', (channel, message) => {
				if (channel === 'chatMessages') {
					socket.emit('message', JSON.parse(message))
				} else {
					socket.emit('users', JSON.parse(message))
				}
			})
		})
	},
	(err) => {
		console.log('Redis connection failed: ', err)
	}
)
