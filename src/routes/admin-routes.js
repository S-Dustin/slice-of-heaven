const express = require('express');
const router = express.Router();
const MenuItem = require('../models/MenuItem'); // Import the MenuItem model

// Route to get all menu items
router.get('/menu', async (req, res) => {
    try {
        const menuItems = await MenuItem.find();
        res.render('menu', { menuItems }); // Render the menu page with menu items data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to add a new menu item
router.post('/admin/add', async (req, res) => {
    const { name, price, category } = req.body;
    try {
        const newItem = new MenuItem({
            name,
            price,
            category
        });
        await newItem.save();
        res.redirect('/admin-dash'); // Redirect to admin dashboard after adding item
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Route to delete a menu item
router.post('/admin/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await MenuItem.findByIdAndDelete(id);
        res.redirect('/admin/dashboard'); // Redirect to admin dashboard after deleting item
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;