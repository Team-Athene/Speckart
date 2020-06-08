// 'use strict'

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const socket = require('socket.io')
const client = require('./lib/redis')

const PORT = 3000

const app = express()
const adminRouter = require('./routes/adminRoutes')()
const userRouter = require('./routes/userRoutes')()
const chatRouter = require('./routes/chatRoutes')()
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
		app.use('/api/admin', adminRouter)
		app.use('/api/user', userRouter)
		app.use('/api/chat', chatRouter)
		// app.use('/api', require('./routes/api'))
		//Start the server
		const server = app.listen(PORT, () => {
			console.log('Server Started')
		})

		const io = socket.listen(server)

		//listen and emit messages and user events (leave or join) using socket.io
		io.on('connection', (socket) => {
			console.log(socket.id)
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
