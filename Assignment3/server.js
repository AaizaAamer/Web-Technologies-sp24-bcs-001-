const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const productRoutes = require("./routes/productRoutes");

const app = express();

const PORT = 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce";

// MongoDB connection
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("MongoDB Connection Error:", err);
    });

// View engine
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

// 404 handler
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});