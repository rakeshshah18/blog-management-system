const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const connection_DB = require("./src/config/db");
const path = require("path");
const routes = require("./src/routes/index");

const app = express();
app.use(express.json());

const PORT = 4000;
app.use(express.urlencoded({ extended: true }));
//database connection
connection_DB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// defining routers
app.use("/api", routes);

//using routes on this APIs

app.use("/uploads", express.static(path.join(__dirname, "./src/resources")));
