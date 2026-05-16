const express = require("express");

const router = express.Router();

const { isLoggedIn } = require("../middleware/authMiddleware");

const {
    getProducts
} = require("../controllers/productController");

router.get("/products", getProducts);

router.get("/checkout", isLoggedIn, (req, res) => {
    res.render("checkout");
});

module.exports = router;