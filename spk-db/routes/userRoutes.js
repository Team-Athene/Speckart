const express = require('express'),
	ProductData = require('../model/ProductData'),
	client = require('./redis-client'),
	userRouter = express.Router()

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
			console.log("TCL: router -> req", req.body)
		const itemId = req.body.itemId;
		const address = req.body.address;
		const add = await client.rpush(address, itemId)
        console.log("TCL: router -> add", add)
		const get = await client.lrange(address, 0, -1)
		console.log("TCL: router -> get", get)
		// client.lrange(address, 0, -1)

		// const client = redis.createClient()
		// client.on("error", function(error) {
		// 	console.error(error);
		//   });
		// redisClient.on('connect', function () {
		// 	console.log('Redis Server Connected');
		// })
		// const data = await client.hset(prod);
		// console.log("TCL: router -> data", data)
		//res.json('true');
		} catch (error) {
            console.log("TCL: router -> error", error)
		}
        
	})

	userRouter.get('/getRecentView/:prod', async (req, res, next) => {
		const prod = req.params.prod;
		console.log("TCL: router -> prod", prod)


		const client = redis.createClient()
		client.on('connect', function () {
			console.log('Redis Server Connected');
		})
		// const data = await client.lpush(prod);
		// console.log("TCL: router -> data", data)
		res.json('data');
	})

	return userRouter;
}
module.exports = router;
