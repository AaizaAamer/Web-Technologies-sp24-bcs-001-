const express = require("express");

const router = express.Router();

const { isLoggedIn } = require("../middleware/authMiddleware");

const {
    getProducts,
    addToCart,
    getCartPage,
    updateCartItem,
    removeCartItem,
    getCheckoutPage,
    placeOrderFromCheckout
} = require("../controllers/productController");

router.get("/products", getProducts);
router.post("/cart/add/:productId", isLoggedIn, addToCart);
router.get("/cart", isLoggedIn, getCartPage);
router.post("/cart/update/:productId", isLoggedIn, updateCartItem);
router.post("/cart/remove/:productId", isLoggedIn, removeCartItem);

router.get("/checkout", isLoggedIn, getCheckoutPage);
router.post("/checkout/place-order", isLoggedIn, placeOrderFromCheckout);

module.exports = router;