const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

/* =========================
   AUTH
========================= */

// POST /api/v1/auth/login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password."
            });
        }

        const payload = {
            user_id: user._id,
            role: user.role
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN || "1h"
        });

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token
        });
    } catch (err) {
        console.error("API login error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

/* =========================
   PRODUCTS
========================= */

// GET /api/v1/products
exports.getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 8;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const category = req.query.category || "";
        const minPrice = parseFloat(req.query.minPrice) || 0;
        const maxPrice = parseFloat(req.query.maxPrice) || 100000;

        const query = {
            name: { $regex: search, $options: "i" },
            price: { $gte: minPrice, $lte: maxPrice }
        };

        if (category) {
            query.category = category;
        }

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);
        const products = await Product.find(query).skip(skip).limit(limit);

        return res.status(200).json({
            success: true,
            data: {
                products,
                pagination: {
                    currentPage: page,
                    totalPages,
                    totalProducts,
                    limit
                }
            }
        });
    } catch (err) {
        console.error("API getProducts error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

// GET /api/v1/products/:id
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found."
            });
        }

        return res.status(200).json({ success: true, data: product });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID." });
        }
        console.error("API getProductById error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

/* =========================
   ORDERS (Protected)
========================= */

// POST /api/v1/orders
exports.createOrder = async (req, res) => {
    try {
        const { items, shippingAddress } = req.body || {};

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Order items are required."
            });
        }

        if (!shippingAddress) {
            return res.status(400).json({
                success: false,
                message: "Shipping address is required."
            });
        }

        // Validate products and calculate total
        let totalAmount = 0;
        const resolvedItems = [];

        for (const item of items) {
            if (!item.product || !item.quantity || item.quantity < 1) {
                return res.status(400).json({
                    success: false,
                    message: "Each item must have a valid product ID and quantity."
                });
            }

            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found.`
                });
            }

            resolvedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;
        }

        const order = new Order({
            user: req.user.user_id,
            items: resolvedItems,
            totalAmount,
            shippingAddress
        });

        await order.save();

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            data: order
        });
    } catch (err) {
        if (err.name === "CastError") {
            return res.status(400).json({ success: false, message: "Invalid product ID." });
        }
        console.error("API createOrder error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

/* =========================
   USER (Protected)
========================= */

// GET /api/v1/user/profile
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.user_id).select("-password");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        return res.status(200).json({ success: true, data: user });
    } catch (err) {
        console.error("API getProfile error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};
