require("dotenv").config({ quiet: true });
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const apiRoutes = require("./routes/apiRoutes");

const app = express();
const PORT = 3000;

const MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce";

/* =========================
   DATABASE CONNECTION
========================= */
mongoose.connect(MONGO_URI)
.then(() => {
    console.log("MongoDB Connected Successfully");
})
.catch((err) => {
    console.log("MongoDB Connection Error:", err);
});

/* =========================
   VIEW ENGINE
========================= */
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* =========================
   BODY PARSERS
========================= */
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   SESSION CONFIGURATION
========================= */
app.use(session({
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
        collectionName: "sessions"
    }),
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));

/* =========================
   FLASH MESSAGES
========================= */
app.use(flash());

/* =========================
   GLOBAL VARIABLES (EJS)
========================= */
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.user = req.session.user || null;
    next();
});

/* =========================
   CACHE CONTROL HEADERS
========================= */
app.use((req, res, next) => {
    // Prevent caching for all pages to avoid back button issues after logout
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    next();
});

/* =========================
   ROUTES
========================= */
app.get("/", (req, res) => {
    res.render("index");
});

/* AUTH ROUTES */
app.use("/", authRoutes);

/* PRODUCT ROUTES */
app.use("/", productRoutes);

/* ADMIN ROUTES */
app.use("/admin", adminRoutes);

/* API ROUTES */
app.use("/api/v1", apiRoutes);

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
   if (req.originalUrl.startsWith("/api/v1")) {
      return res.status(404).json({
         success: false,
         message: "API route not found."
      });
   }

   res.status(404).render("404");
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});