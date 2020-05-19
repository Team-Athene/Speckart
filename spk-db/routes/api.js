'use strict'

import express from 'express'

const router = express.Router()

router.get('/', (req, res, next) => res.send('Welcome to SpecKart'))
router.use('/api/admin', require('./adminRoutes')())
router.use('/api/user', require('./userRoutes')())

module.exports = router
