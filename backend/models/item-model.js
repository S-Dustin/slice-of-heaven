// models/item-model.js
const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema({
    name: String,
    category: String,
    description: String,
    price: Number,
    discount: Boolean,
    discountedPrice: Number,
    picture: String
}, { collection: 'Menu'});

const MenuItem = mongoose.model("Menu", menuItemSchema);

module.exports = MenuItem;