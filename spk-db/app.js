const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const adminRouter = require("./routes/adminRoutes")();
const userRouter = require("./routes/userRoutes")();
const app = express();
app.set("view engine", "ejs");
app.use(express.static("./public"));
app.options("/*", (req, res) => {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
	res.header(
		"Access-Control-Allow-Headers",
		"Content-Type, Authorization, Content-Length, X-Requested-With"
	);
	res.sendStatus(200);
})
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/img", express.static(path.join(__dirname, "public/uploads")));
app.use("/api/admin", adminRouter);
app.use("/api/user", userRouter);

const port = 3000;
app.listen(port, () => console.log(`Server started on port ${{port}}`))
