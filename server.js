const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Offer = require("./offerSchema");
// const Offer = require("./offerSchema");

require("dotenv").config();
const uri = process.env.MONGO_URI;

//DB

mongoose.set("strictQuery", false); //supress warning
mongoose
	.connect(uri)
	.then(() => console.log("Successfully connected to MongoDB"))
	.catch((error) => console.error(error));

app.get("/", (req, res) => {
	res.send("Welcome");
});

app.listen(4000, () => {
	console.log("Connected to port 4000", "");
});
