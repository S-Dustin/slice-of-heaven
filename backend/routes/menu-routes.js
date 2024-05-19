// menu-routes.js
const express = require("express");
const MenuItem = require("../models/item-model");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        console.log("Menu route called");
        const menuItems = await MenuItem.find({});
        console.log("Menu items fetched: ${menuItems.length}");
        res.json(menuItems);
    } catch (error) {
        console.error("Error fetching menu items from MongoDB:", error);
        res.status(500).send("Server Error");
    }
});

module.exports = router;