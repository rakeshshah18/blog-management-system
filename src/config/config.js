const dotenv = require("dotenv");

dotenv.config();

const config = {
    MONGO_URI: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/blogdb",
    JWT_SECRET: process.env.JWT_SECRET_KEY || "secret-key",
    PORT: process.env.PORT || 4000,
};

module.exports = config;
