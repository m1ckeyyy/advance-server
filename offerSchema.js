const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
	id: { type: String, required: true },
	numer_kontaktowy: String,
	tytul: String,
	opis: String,
	cena: String,
	metraz: String,
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
	klimatyzacja: String,
});

const Offer = mongoose.model("Offer", offerSchema);
module.exports = mongoose.model("Offer", offerSchema);
