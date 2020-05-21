'use strict'
import express from 'express'
import ProductData from '../model/ProductData'
import upload from '../middleware/multer'
import client from '../lib/redis-search'
import redisClient from './redis-client'
const router = express.Router()

export const viewById = router.get('/view/:id', async (req, res, next) => {
	const id = req.params.id
	const data = await ProductData.findById(id)
	data.file.forEach((img) => {
		img.path = img.path.replace('public/uploads', 'img')
	})
	res.json(data.file)
})
export const recentView = router.post('/recentView', async (req, res, next) => {
	try {
		const itemId = req.body.itemId,
			address = req.body.address,
			data = 'REC' + address
		console.log('TCL: router -> req.body', req.body)

		await client.lrem(data, 0, itemId)
		await client.lpush(data, itemId)
		await client.ltrim(data, 0, 5)
		res.send(true)
	} catch (error) {
		console.log('TCL: router -> error', error)
	}
})
export const recentViewByAddress = router.get(
	'/getRecentView/:address',
	async (req, res, next) => {
		const address = req.params.address,
			data = 'REC' + address
		const get = await client.lrange(data, 0, -1)
		console.log('TCL: router -> get', get)
		const a = await client.zrevrange('itemCount', 0, 5)
		console.log('TCL: router -> a', a)
		res.send({ recent: get, trend: a })
	}
)
export const addCart = router.post('/addCart', async (req, res, next) => {
	try {
		const cart = req.body.cart,
			address = req.body.address,
			data = 'CART' + address
		if (cart == '0') {
			const itemId = req.body.itemId
			console.log('TCL: router -> itemId', itemId)
			itemId.forEach(async (element) => {
				await client.zincrby('itemCount', parseInt(element.count), element.id)
			})
			await client.del(data)
		} else {
			await client.set(data, cart)
		}
		res.send(true)
	} catch (error) {
		console.log('TCL: router -> error', error)
	}
})
export const getCartByAddress = router.get(
	'/getCart/:address',
	async (req, res, next) => {
		const address = req.params.address,
			data = 'CART' + address
		const get = await client.get(data)
		const brand = await client.lrange('itemBrand', 0, -1)
		res.json({ cart: get, brand: brand })
	}
)
export const getProducts = router.get(
	'/getProducts/:data',
	async (req, res, next) => {
		const data = JSON.parse(req.params.data)
		const key = data[0]
		const value = data[1]
		const arg = '@' + key + ':' + value
		const search = await redisearch.search(arg)
		console.log('TCL: router -> search', search)
		let productList = []
		const array = search.results
		array.forEach((element) => {
			productList.push(element.docId)
		})
		res.send(productList)
	}
)
