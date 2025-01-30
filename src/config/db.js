require("dotenv").config();
const mongoose = require("mongoose");
const { MONGO_URI } = require("../config/config");

console.log("Debug: MONGO_URI =", MONGO_URI); // ✅ Add this line for debugging

const connection_DB = async () => {
    try {
        console.log("MongoDB URL: ", MONGO_URI);
        if (!MONGO_URI) throw new Error("MONGO_URI is undefined. Check your .env file!");
        
        await mongoose.connect(MONGO_URI, {}); 
        console.log("Connected.");
    } catch (error) {
        console.log("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connection_DB;
