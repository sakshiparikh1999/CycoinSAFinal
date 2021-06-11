const express = require("express");
const path = require("path");
var indexroutes = require("./routes");
const app = express();
const session = require('express-session');
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/cycoin");


app.use(session({
    secret: 'userdetails',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.set("view engine", "ejs");

app.use("/", indexroutes);

const PORT = 3002;
app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));