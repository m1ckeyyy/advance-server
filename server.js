const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Offer = require("./offerSchema");
const cors = require("cors");

require("dotenv").config();
const uri = process.env.MONGO_URI;

app.use(express.json());
app.use(
	cors({
		origin: "http://127.0.0.1:3000", //https://qhc5nx-5173.preview.csb.app
		methods: ["GET", "POST", "PUT", "DELETE"],
		credentials: true,
	})
);
// app.use((req, res, next) => {
// 	res.set("Access-Control-Allow-Origin", "http://127.0.0.1:3000"); //https://qhc5nx-5173.preview.csb.app
// 	// res.set('Access-Control-Allow-Origin', 'http://localhost:3000'); //https://qhc5nx-5173.preview.csb.app
// 	res.setHeader("Access-Control-Allow-Credentials", true);
// 	res.setHeader("Access-Control-Allow-Headers", "Content-Type");
// 	res.setHeader("Access-Control-Allow-Headers", "Authorization");
// 	next();
// });

//DB

mongoose.set("strictQuery", false); //supress warning
mongoose
	.connect(uri)
	.then(() => console.log("Successfully connected to MongoDB"))
	.catch((error) => console.error(error));

app.get("/", (req, res) => {
	res.send("Welcome");
});
app.post("/admin", (req, res) => {
	try {
		let { email, password } = req.body;
		email = email.toLowerCase();
		console.log(req.body);
		User.findOne({ email }).then((user) => {
			if (!user) {
				return res.status(404).send("Invalid email or password");
			}
			bcrypt.compare(password, user.password).then((isMatching) => {
				if (isMatching) {
					// password = user.password;
					console.log("matching!");
					const accessToken = jwt.sign(
						email,
						process.env.ACCESS_TOKEN_SECRET
					);
					res.cookie("access_token", accessToken, {
						httpOnly: false,
						secure: false,
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
	res.status(200).send("COOKIE TOKEN: xaxaxaxaxaxa");
});

app.listen(4000, () => {
	console.log("Connected to port 4000");
});
