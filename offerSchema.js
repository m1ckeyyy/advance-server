const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
	numer_kontaktowy: String,
	tytul: String,
	opis: String,
	cena: Number,
	metraz: Number,
	zdjecia: Array,
	liczba_pokoi: String,
	pietro: String,
	stan_wykonczenia: String,
	ogrzewanie: String,
	rok_budowy: String,
	balkon: String,
	ogrod: String,
	taras: String,
	forma_wlasnosci: String,
	zabezpieczenia: String,
	wyposazenie: String,
});

const Offer = mongoose.model("Offer", offerSchema);
module.exports = mongoose.model("Offer", offerSchema);