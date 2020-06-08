const mongoose = require('mongoose')
const mongoUrl = process.env.MONGO_URL
mongoose
	.connect(mongoUrl, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useFindAndModify: false,
	})
	.then(() => console.log('MongoDB Connected'))
	.catch((err) => console.log(err))

const Schema = mongoose.Schema
const productSchema = new Schema({
	itemId: {
		type: String,
		required: true,
	},
	file: [
		{
			_id: {
				required: false,
			},
			originalname: {
				type: String,
				required: true,
			},
			filename: {
				type: String,
				required: true,
			},
			path: {
				type: String,
				required: true,
			},
		},
	],
	itemName: {
		type: String,
		required: true,
	},
	itemType: {
		type: String,
		required: true,
	},
	itemPrice: {
		type: String,
		required: true,
	},
	itemDetails: {
		type: String,
		required: true,
	},
	itemBrand: {
		type: String,
		required: true,
	},
	itemColor: {
		type: String,
		required: true,
	},
})
const ProductData = mongoose.model('ProductData', productSchema)
module.exports = ProductData
