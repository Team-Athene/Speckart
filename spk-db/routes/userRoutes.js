const express = require('express'),
	ProductData = require('../model/ProductData'),
	client = require('../middleware/redis-client'),
	userRouter = express.Router(),
	redisearch = require('../middleware/redis-search')

const router = () => {
	userRouter.get('/view/:id', async (req, res, next) => {
		const id = req.params.id
		const data = await ProductData.findById(id)
		data.file.forEach((img) => {
			img.path = img.path.replace('public/uploads', 'img')
		})
		res.json(data.file)
	})

	userRouter.post('/recentView', async (req, res, next) => {
		try {
			const itemId = req.body.itemId,
				address = req.body.address,
				data = 'REC' + address

			await client.lrem(data, 0, itemId)
			await client.lpush(data, itemId)
			await client.ltrim(data, 0, 5)
			res.send(true)
		} catch (error) {}
	})

	userRouter.get('/getRecentView/:address', async (req, res, next) => {
		const address = req.params.address,
			data = 'REC' + address
		const get = await client.lrange(data, 0, -1)
		const a = await client.zrevrange('itemCount', 0, 5)
		res.send({ recent: get, trend: a })
	})

	userRouter.post('/addCart', async (req, res, next) => {
		try {
			const cart = req.body.cart,
				address = req.body.address,
				data = 'CART' + address
			if (cart == '0') {
				const itemId = req.body.itemId
				itemId.forEach(async (element) => {
					await client.zincrby('itemCount', parseInt(element.count), element.id)
				})
				await client.del(data)
			} else {
				await client.set(data, cart)
			}
			res.send(true)
		} catch (error) {}
	})

	userRouter.get('/getCart/:address', async (req, res, next) => {
		const address = req.params.address,
			data = 'CART' + address
		const get = await client.get(data)
		const brand = await client.lrange('itemBrand', 0, -1)
		res.json({ cart: get, brand: brand })
	})

	userRouter.get('/getProducts/:data', async (req, res, next) => {
		const data = JSON.parse(req.params.data)
		const key = data[0]
		const value = data[1]
		const arg = '@' + key + ':' + value
		const search = await redisearch.search(arg)
		let productList = []
		const array = search.results
		array.forEach((element) => {
			productList.push(element.docId)
		})
		res.send(productList)
	})

	return userRouter
}
module.exports = router
