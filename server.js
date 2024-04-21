const express = require("express");
const jwt = require("jsonwebtoken");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const Offer = require("./offerSchema");
const Admin = require("./adminSchema");
const cors = require("cors");
const bcrypt = require("bcrypt");
const session = require("express-session");
const Cookies = require("js-cookie");

require("dotenv").config(); //.env for encrypting cookies
const uri = process.env.MONGO_URI;
// console.log(Admin);

app.use(express.json());
app.use(
	cors({
		origin: "http://127.0.0.1:3000",
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
app.use(cookieParser());
// app.use((req, res, next) => {
// 	res.set("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); //https://qhc5nx-5173.preview.csb.app
// 	// res.set('Access-Control-Allow-Origin', 'http://localhost:3000'); //https://qhc5nx-5173.preview.csb.app
// 	res.setHeader("Access-Control-Allow-Credentials", true);
// 	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
// 	res.setHeader("Access-Control-Allow-Headers", "Authorization");
// 	next();
// });

// app.use(
// 	session({
// 		secret: "mysdfdsfsdsfdhoewfhoewrwesd23344",
// 		cookie: { maxAge: 999999999 },
// 		resave: false,
// 		saveUninitialized: true,
// 	})
// );
//DB
mongoose.set("strictQuery", false); //supress warning
mongoose
	.connect(uri)
	.then(() => console.log("Successfully connected to MongoDB"))
	.catch((error) => console.error(error));

app.get("/", (req, res) => {
	// res.cookie("a", "b");
	// const admins = await Admin.find();
	// console.log("Admins: ", admins);
	res.send("Welcome");
});
app.post("/auth", (req, res) => {
	// res.cookie("a", "b");
	// const admins = await Admin.find();

	console.log("req:  ", req.body);
	console.log("RRR:", req.cookies);
	const a = req.cookies;
	res.send(a);
});
app.post("/admin-login", (req, res) => {
	try {
		let { email, password } = req.body;
		// email = email.toLowerCase();
		// console.log(req.body);
		Admin.findOne({ email }).then((admin) => {
			if (!admin) {
				return res.status(401).send("Invalid email or password");
			}
			bcrypt.compare(password, admin.password).then((isMatching) => {
				if (isMatching) {
					// password = admin.password;
					console.log("matching!");
					const accessToken = jwt.sign(
						{ email },
						process.env.ACCESS_TOKEN_SECRET,
						{ expiresIn: "2 days" }
					);
					// res.cookie("access_token", accessToken, {
					// 	httpOnly: false,
					// 	secure: false,
					// 	//maxAge: 99999,
					// 	expires: new Date(Date.now() + 9999999999),
					// });

					console.log("accessToken: ", accessToken);

					res.cookie("cookieName", 5, { expiresIn: 11000, priority: "high" });

					res
						.status(200)
						.send({ message: "Admin verified", access_token: accessToken });
				} else {
					console.log("not matching :(");
					res.status(401).send({
						message: "Incorrect email or password",
					});
				}
			});
		});
	} catch (e) {
		res.status(500).send({ message: "An error occured" });
	}
	// res.status(200).send("End of login query");
});

// app.post("/admin-register", (req, res) => {
// 	let { email, password } = req.body;
// 	// email = email.toLowerCase();
// 	const newAdmin = new Admin({ email, password });
// 	console.log("server.js,/register,newAdmin: ", newAdmin);
// 	// const validationError = newAdmin.validateSync({ email, password });

// 	// if (validationError) {
// 	//   const { message } = validationError.errors.password || validationError.errors.email;
// 	//   console.log(message);
// 	//   return res.status(400).send({ error: message });
// 	// }
// 	Admin.findOne({ email }).then((user) => {
// 		if (user) {
// 			console.log("There is already a user with that email");
// 			return res
// 				.status(409)
// 				.send({ error: "There is already a user with that email" });
// 		}
// 		newAdmin.save();
// 		// 	(error) => {
// 		// 	if (error) {
// 		// 		console.log(error);
// 		// 		res.status(500).send("Error saving user to database");
// 		// 	} else {
// 		// 		console.log("addmin regisstered [server]");
// 		// 		res.status(200).send({ message: "registered new admin" });
// 		// 	}
// 		// }
// 	});
// });

app.listen(4000, () => {
	console.log("Connected to port 4000");
});
