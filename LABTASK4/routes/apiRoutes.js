const express = require("express");
const router = express.Router();

const {
    login,
    getProducts,
    getProductById,
    createOrder,
    getProfile
} = require("../controllers/apiController");

const { verifyToken } = require("../middleware/jwtMiddleware");

/* =========================
   AUTH
========================= */
// POST /api/v1/auth/login
router.post("/auth/login", login);

/* =========================
   PRODUCTS (Public)
========================= */
// GET /api/v1/products
router.get("/products", getProducts);

// GET /api/v1/products/:id
router.get("/products/:id", getProductById);

/* =========================
   ORDERS (Protected)
========================= */
// POST /api/v1/orders
router.post("/orders", verifyToken, createOrder);

/* =========================
   USER (Protected)
========================= */
// GET /api/v1/user/profile
router.get("/user/profile", verifyToken, getProfile);

module.exports = router;
