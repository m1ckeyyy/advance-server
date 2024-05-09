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
//const Cookies = require("js-cookie");

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
//DB
mongoose.set("strictQuery", false); //supress warning
mongoose
	.connect(uri)
	.then(() => console.log("Successfully connected to MongoDB"))
	.catch((error) => console.error(error));

// app.get("/", (req, res) => {
// 	res.send("Welcome");
// });
app.post("/auth", (req, res) => {
	console.log("RRR:", req.cookies.access_token);
	const token = req.cookies.access_token;
	if (!token) return res.status(401).send({ message: "Token is missing" });
	jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
		if (err) {
			console.log("token: ", token, "jwt verifcation ERROR: ");
			return res.status(403);
		}
		console.log(`${user.email} successfully verified with JWT`);
		return res.status(200).send({
			message: `User was verified, grant access to protected routes`,
		});
	});
});
app.post("/admin-login", (req, res) => {
	try {
		let { email, password } = req.body;
		email = email.toLowerCase();
		Admin.findOne({ email }).then((admin) => {
			if (!admin) {
				return res.status(401).send("Invalid email or password");
			}
			bcrypt.compare(password, admin.password).then((isMatching) => {
				if (isMatching) {
					console.log("credentials validated");
					const accessToken = jwt.sign(
						{ email },
						process.env.ACCESS_TOKEN_SECRET,
						{ expiresIn: "2 days" }
					);

					res.cookie("access_token", accessToken, {
						expires: new Date(Date.now() + 9999999),
						maxAge: 9999999,
						httpOnly: false,
					});

					res.status(200).send({ message: "Admin verified" });
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
});

app.post("/upload-offer", (req, res) => {
	const { offer } = req.body;
	const newOffer = new Offer({ ...offer });
});
//app.post('/edit-offer')

app.listen(4000, () => {
	console.log("Connected to port 4000");
});
