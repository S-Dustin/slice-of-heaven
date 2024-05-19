// src/config/dbConfig.js
const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://sliceofheaven:G6zcXJ8LGh6LTxJW@heavenscluster.lnxc31q.mongodb.net/Slice_of_Heaven?retryWrites=true&w=majority&appName=HeavensCluster');
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB", error);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;