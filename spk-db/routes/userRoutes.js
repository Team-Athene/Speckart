const express = require('express'),
	ProductData = require('../model/ProductData'),
	redis = require('redis'),
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
		// const prod = req.body.prod;
        // console.log("TCL: router -> prod", prod)
		// const addr = req.body.addr;
        // console.log("TCL: router -> addr", addr)
		// console.log("TCL: router -> prod", prod)

		// const client = redis.createClient()
		// client.on("error", function(error) {
		// 	console.error(error);
		//   });
		// client.on('connect', function () {
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
