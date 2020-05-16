const express = require("express"),
	ProductData = require("../model/ProductData"),
	adminRouter = express.Router(),
	upload = require("../middleware/multer");
const router = () => {
	adminRouter.post("/add", upload.array("product"), (req, res, next) => {
		const files = req.files,
			Product = {
				productId: req.body.product,
				file: files
			},
			newProduct = ProductData(Product) ;
		newProduct.save().then(() => res.json(newProduct._id)); 
	})
	return adminRouter;
}
module.exports = router;
