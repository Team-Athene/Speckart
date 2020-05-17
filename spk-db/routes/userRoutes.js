const express = require('express'),
	ProductData = require('../model/ProductData'),
	redis = require('redis')
	// client = redis.createClient({
	// 	port: 6379
	// }),
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
        console.log("TCL: router -> req", req.body)
		const itemId = req.body.itemId;
		const address = req.body.address;
		const redisClient = require('./redis-client');
		await redisClient.setAsync('Name', 'Mekha')
		console.log(await redisClient.getAsync('Name'))
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
