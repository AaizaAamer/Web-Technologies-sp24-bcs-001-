const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const productRoutes = require("./routes/productRoutes");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
.then(() => {
    console.log("MongoDB Connected");
})
.catch((err) => {
    console.log(err);
});

app.set("view engine", "ejs");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(productRoutes);

app.get("/", (req, res) => {
    res.render("index");
});

app.listen(3000, () => {
    console.log("Server Running");
});