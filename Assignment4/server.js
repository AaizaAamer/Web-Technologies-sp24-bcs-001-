
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const productRoutes = require("./routes/productRoutes"); 
const adminRoutes = require("./routes/adminRoutes");     


const app = express();

const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce";

// MongoDB Connection
mongoose.connect(MONGO_URI)
.then(() => {

    console.log("MongoDB Connected Successfully");

})
.catch((err) => {

    console.log("MongoDB Connection Error:", err);

});

// View Engine
app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {

    res.render("index");

});

app.use("/", productRoutes);
app.use("/admin", adminRoutes);

// 404 Handler
app.use((req, res) => {

    res.status(404).send("404 - Page Not Found");

});

// Server
app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});