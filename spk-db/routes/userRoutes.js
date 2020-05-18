const express = require('express'),
	ProductData = require('../model/ProductData'),
	client = require('./redis-client'),
	userRouter = express.Router(),
	redisearch = require('./redis-search')


const router = () => {

	userRouter.get('/view/:id', async (req, res, next) => {
		const id = req.params.id;
		const data = await ProductData.findById(id);
		data.file.forEach(img => {
			img.path = img.path.replace('public/uploads', 'img');
		});
		res.json(data.file);
	})

	userRouter.post('/recentView', async (req, res, next) => {
		try {
			const itemId = req.body.itemId,
			address = req.body.address,
			data = "REC" + address
            console.log("TCL: router -> req.body", req.body)

			await client.lrem(data, 0, itemId)
			await client.lpush(data, itemId)
			await client.ltrim(data, 0, 5)
			res.send(true)

		} catch (error) {
			console.log("TCL: router -> error", error)
		}

	})

	userRouter.get('/getRecentView/:address', async (req, res, next) => {
		const address = req.params.address,
		data = "REC" + address
		console.log("TCL: router -> address", data)


		const get = await client.lrange(data, 0, -1)
		console.log("TCL: router -> get", get)
		res.json(get);
	})

	userRouter.post('/addCart', async (req, res, next) => {
		try {
			const cart = req.body.cart,
				address = req.body.address,
				data = "CART" + address
			if(cart == '0') {
				await client.del(data)
			}
			else{
				await client.set(data, cart)
			}
			res.send(true)

		} catch (error) {
			console.log("TCL: router -> error", error)
		}

	})

	userRouter.get('/getCart/:address', async (req, res, next) => {
		const address = req.params.address,
		data = "CART" + address
		const get = await client.get(data)
		res.json(get);
	})

	userRouter.get('/getProducts/:data', async (req, res, next) => {
	const data = JSON.parse(req.params.data)
		const key = data[0]
		const value = data[1]
		const arg = '@'+key+':'+value
		redisearch.search(arg, function( error, data) {
			if(error) {
				console.log("TCL: router -> error", error)
			} else {
				console.log("TCL: router -> data", data)
			}
		})
		res.json(key);
	})

	return userRouter;
}
module.exports = router;
