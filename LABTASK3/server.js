const express = require("express");
const mongoose = require("mongoose");
const path = require("path");

const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");

const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

const MONGO_URI = "mongodb://127.0.0.1:27017/ecommerce";
const SESSION_SECRET = process.env.SESSION_SECRET || "mysecretkey";
const isProduction = process.env.NODE_ENV === "production";

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

if (isProduction) {
   app.set("trust proxy", 1);
}

/* =========================
   STATIC FILES
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   SESSION CONFIGURATION
========================= */
app.use(session({
   name: "labtask.sid",
   secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
   rolling: true,
   unset: "destroy",
    store: MongoStore.create({
        mongoUrl: MONGO_URI,
      collectionName: "sessions",
      ttl: 60 * 60 * 24,
      touchAfter: 60 * 60
    }),
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
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

app.use((req, res, next) => {
   if (req.session.user) {
      res.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
      res.set("Pragma", "no-cache");
      res.set("Expires", "0");
   }

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

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
    res.status(404).render("404"); 
});

/* =========================
   START SERVER
========================= */
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});