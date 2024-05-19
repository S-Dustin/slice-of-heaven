/// server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
require('dotenv').config();
const menuRoutes = require("./routes/menu-routes"); // Imports menu routes
const loginRoutes = require("./routes/login-routes"); // Imports login routes
const userRoutes = require("./routes/user-routes"); // Imports user routes

const uri = 'mongodb+srv://sliceofheaven:G6zcXJ8LGh6LTxJW@heavenscluster.lnxc31q.mongodb.net/Slice_of_Heaven?retryWrites=true&w=majority&appName=HeavensCluster';

async function connect() {
    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
    }
}

connect();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.use('/menu', menuRoutes);
app.use('/auth', loginRoutes);
app.use('/user', userRoutes);

app.listen(8000, () => {
    console.log("Server started on port 8000");
});