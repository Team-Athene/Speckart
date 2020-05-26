'use strict'
import express from 'express'
import ProductData from '../../model/ProductData'
import upload from '../../middleware/multer'
const client = require('../../lib/redis-search')
import redisClient from '../../middleware/redis-client'
const router = express.Router()

export const add = router.post(
	'/admin/add',
	upload.array('product'),
	async (req, res, next) => {
		const files = req.files
		const { product } = req.body
		const {
			itemId,
			itemName,
			itemType,
			itemPrice,
			itemDetails,
			itemBrand,
			itemColor,
		} = JSON.parse(product)
		const Product = {
			itemId,
			file: files,
			itemName,
			itemType,
			itemPrice,
			itemDetails,
			itemBrand,
			itemColor,
		}
		const newProduct = ProductData(Product)
		newProduct.save().then(() => res.json(newProduct._id))
		client.createIndex(
			[
				client.fieldDefinition.numeric('itemId', true),
				client.fieldDefinition.text('itemName', true),
				client.fieldDefinition.text('itemType', true),
				client.fieldDefinition.numeric('itemPrice', true),
				client.fieldDefinition.text('itemDetails', true),
				client.fieldDefinition.text('itemBrand', true),
				client.fieldDefinition.text('itemColor', true),
			],
			function (error, val) {
				if (error) {
				} else {
				}
			}
		)
		client.add(
			itemId,
			{
				itemId: itemId,
				itemName: itemName,
				itemType: itemType,
				itemPrice: itemPrice,
				itemDetails: itemDetails,
				itemBrand: itemBrand,
				itemColor: itemColor,
			},
			function (error, val) {
				if (error) {
				} else {
				}
			}
		)
		await redisClient.lrem('itemBrand', 0, itemBrand.toUpperCase())
		await redisClient.lpush('itemBrand', itemBrand.toUpperCase())
		await redisClient.zadd('itemCount', 0, itemId)
		const c = await client.getDoc(itemId)
		console.log('TCL: router -> c', c)
	}
)
export const added = router.post('/added', async (req, res, next) => {
	try {
		// await redisClient.zadd("itemCount", 80, 'itemId7')
		const len = await redisClient.zcard('itemCount')
		console.log('TCL: router -> len', len)
		await redisClient.zincrby('itemCount', 300, 'itemId1')
		const a = await redisClient.zrevrange('itemCount', 0, 5)
		console.log('TCL: router -> a', a)
	} catch (error) {
		console.log('Log: error', error)
	}
})
