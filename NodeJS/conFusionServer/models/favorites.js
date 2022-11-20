const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const favoriteSchema = new Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    unique: true,
    required: true,
  },
  dishes: {
    type: [{ type: mongoose.Types.ObjectId, ref: "Dish" }],
    required: true,
  }
}, {timestamps: true});

const Favorites = mongoose.model("Favorites", favoriteSchema);

module.exports = Favorites;
