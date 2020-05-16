const multer = require("multer");
const path = require("path");
//Define Storage Path and File Name
const storage = multer.diskStorage({
	destination: (req, file, callBack) => {
		callBack(null, "./public/uploads/")
	},
	filename: (req, file, callBack) => {
		callBack(null, `SPK_${Date.now()}_${file.originalname}`)
	}
});
//Upload using multer
const upload = multer({
	storage: storage,
	fileFilter: function(req, file, cb) {
		checkFileType(file, cb)
	}
});
//Check File Type
function checkFileType(file, cb) {
	//Allowed Extensions
	const fileTypes = /jpeg|jpg|png|gif/;
	//Check Extension
	const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
	//Check mime
	const mimetype = fileTypes.test(file.mimetype);

	if (mimetype && extname) {
		return cb(null, true);
	} else {
		cb("Error! Only Images");
	}
}

module.exports = upload;
