// dotenv.config();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const connection_DB = async () => {
    try {
        console.log("MongoDB URL : ", process.env.MONGO_URI); // Debug log
        await mongoose.connect(process.env.MONGO_URI, {
            
        });
        console.log("Connected.");
    } catch (error) {
        console.log("Error, connecting to MongoDB", error.message);
    }
};

module.exports = connection_DB;
