const express = require("express");

const router = express.Router();

const { isLoggedIn } = require("../middleware/authMiddleware");

const {
    getProducts,
    addToCart,
    getCheckoutPage,
    placeOrderFromCheckout
} = require("../controllers/productController");

router.get("/products", getProducts);
router.post("/cart/add/:productId", isLoggedIn, addToCart);

router.get("/checkout", isLoggedIn, getCheckoutPage);
router.post("/checkout/place-order", isLoggedIn, placeOrderFromCheckout);

module.exports = router;