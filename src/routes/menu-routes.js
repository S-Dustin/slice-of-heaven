// menu-routes.js
const express = require("express");
const MenuItem = require("../models/item-model");
const router = express.Router();

// Fetch menu items
router.get("/getItems", async (req, res) => {
    try {
        const { name } = req.query;
        if (name) {
            // Fetch menu item by name
            const menuItem = await MenuItem.findOne({ name });
            if (!menuItem) {
                return res.status(404).json({ error: 'Menu item not found' });
            }
            return res.json(menuItem);
        } else {
            // Fetch all menu items
            const menuItems = await MenuItem.find({});
            return res.json(menuItems);
        }
    } catch (error) {
        console.error("Error fetching menu items from MongoDB:", error);
        res.status(500).send("Server Error");
    }
});

// Update a menu item by name
router.put("/updateItem", async (req, res) => {
    try {
        const name = req.body.name;
        console.log(name);
        // Find the menu item by name in the database
        const menuItem = await MenuItem.findOne({ name: name });
        if (menuItem) {
            // Update the menu item with the new data
            Object.assign(menuItem, req.body);
            // Save the updated menu item to the database
            const updatedMenuItem = await menuItem.save();
            res.json(updatedMenuItem);
        } else {
            res.status(404).json({ error: 'Menu item not found' });
        }
    } catch (error) {
        console.error('Error updating menu item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete a menu item by name
router.delete("/removeItem", async (req, res) => {
    const name = req.query.name;
    try {
        // Find the menu item in the database by name and delete it
        const deletedItem = await MenuItem.findOneAndDelete({ name });

        if (!deletedItem) { // Return 404 if item is not found
            return res.status(404).json({ error: 'Menu item not found' });
        }
        res.status(204).send();
    } catch (error) {
        // If an error occurs during the deletion process, return 500 Internal Server Error
        console.error('Error deleting menu item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Add a new menu item
router.post('/newItem', async (req, res) => {
    const newItemData = req.body;
    try {
        const newItem = new MenuItem(newItemData); // Validates object
        const savedItem = await newItem.save(); // Saves new item to MongoDB
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error saving menu item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;