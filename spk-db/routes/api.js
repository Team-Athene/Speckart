'use strict'

import express from 'express'
import * as admin from './admin'
import * as user from './user'
import * as chat from './sroutes'
const router = express.Router()

router.get('/', (req, res, next) => res.send('Welcome to SpecKart'))
// router.use('/api/admin', require('./adminRoutes')())
// router.use('/api/user', require('./userRoutes')())

//Admin
router.post('admin/add', admin.add)
router.post('admin/added', admin.added)

//User
router.get('user/view/:id', user.viewById)
router.post('user/recentView', user.recentView)
router.post('user/addCart', user.addCart)
router.get('user/getRecentView/:address', user.recentViewByAddress)
router.get('user/getCart/:addresss', user.getCartByAddress)
router.get('user/getProducts/:data', user.getProducts)

//Chat
// router.get('/', chat.home)
router.get('/chat/:username', chat.chatRoom)
router.get('/messages', chat.messages)
router.get('/users', chat.users)
router.post('/user', chat.createUser)
router.post('/deleteUser', chat.deleteUser)
router.post('/message', chat.createMessage)
module.exports = router
