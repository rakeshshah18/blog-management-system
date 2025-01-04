// dotenv.config();
const mongoose = require("mongoose");
// const dotenv = require("dotenv");
const { MONGO_URI } = require("../config/config")

// dotenv.config();

const connection_DB = async () => {
    try {
        console.log("MongoDB URL : ", MONGO_URI); // Debug log
        await mongoose.connect(MONGO_URI, {
        });
        console.log("Connected.");
    } catch (error) {
        console.log("Error, connecting to MongoDB", error.message);
    }
};

module.exports = connection_DB;
