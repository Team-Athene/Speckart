const express = require('express'),
	ProductData = require('../model/ProductData'),
	adminRouter = express.Router(),
	upload = require('../middleware/multer')
const router = () => {
	adminRouter.post('/add', upload.array('product'), (req, res, next) => {
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
	})
	return adminRouter
}
module.exports = router
