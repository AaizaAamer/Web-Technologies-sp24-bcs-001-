const Product = require("../models/Product");
const Order = require("../models/Order");

const getSessionCart = (req) => {
    if (!Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }

    return req.session.cart;
};

const getCartCount = (cart = []) => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
};

const wantsJson = (req) => {
    const accept = req.get("accept") || "";
    return req.xhr || accept.includes("application/json");
};

const buildCartDetails = async (req) => {
    const cart = getSessionCart(req);

    if (cart.length === 0) {
        return {
            cartItems: [],
            totalAmount: 0,
            cartCount: 0
        };
    }

    const cartProductIds = cart.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: cartProductIds } }).select("name price stock image");
    const productMap = new Map(products.map((product) => [String(product._id), product]));

    const cartItems = [];
    let totalAmount = 0;

    for (const item of cart) {
        const product = productMap.get(item.productId);

        if (!product) {
            continue;
        }

        const safeQuantity = Math.min(item.quantity, product.stock);
        const lineTotal = product.price * safeQuantity;
        totalAmount += lineTotal;

        cartItems.push({
            product,
            quantity: safeQuantity,
            lineTotal
        });
    }

    req.session.cart = cartItems.map((item) => ({
        productId: String(item.product._id),
        quantity: item.quantity
    }));

    return {
        cartItems,
        totalAmount,
        cartCount: getCartCount(req.session.cart)
    };
};

const getProducts = async (req, res) => {

    const page = parseInt(req.query.page) || 1;

    const limit = 8;

    const skip = (page - 1) * limit;

    const search = req.query.search || "";

    const category = req.query.category || "";

    const minPrice = req.query.minPrice || 0;

    const maxPrice = req.query.maxPrice || 100000;

    let query = {

        name: {
            $regex: search,
            $options: "i"
        },

        price: {
            $gte: minPrice,
            $lte: maxPrice
        }

    };

    if(category){

        query.category = category;

    }

    const totalProducts = await Product.countDocuments(query);

    const totalPages = Math.ceil(totalProducts / limit);

    const products = await Product.find(query)
    .skip(skip)
    .limit(limit);

    const cartCount = getCartCount(getSessionCart(req));

    res.render("products", {
        layout: false,
        products,

        currentPage: page,

        totalPages,

        search,

        category,

        minPrice,

        maxPrice,

        cartCount

    });

};

const addToCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const requestedQuantity = Number.parseInt(req.body?.quantity, 10);
        const quantity = Number.isInteger(requestedQuantity) ? requestedQuantity : 1;

        if (quantity < 1) {
            if (wantsJson(req)) {
                return res.status(400).json({ success: false, message: "Quantity must be at least 1" });
            }

            req.flash("error_msg", "Quantity must be at least 1");
            return res.redirect("/products");
        }

        const product = await Product.findById(productId);

        if (!product) {
            if (wantsJson(req)) {
                return res.status(404).json({ success: false, message: "Product not found" });
            }

            req.flash("error_msg", "Product not found");
            return res.redirect("/products");
        }

        if (product.stock < 1) {
            if (wantsJson(req)) {
                return res.status(400).json({ success: false, message: "This product is out of stock" });
            }

            req.flash("error_msg", "This product is out of stock");
            return res.redirect("/products");
        }

        const cart = getSessionCart(req);
        const existingItem = cart.find((item) => item.productId === String(product._id));

        if (existingItem) {
            const nextQuantity = existingItem.quantity + quantity;

            if (nextQuantity > product.stock) {
                if (wantsJson(req)) {
                    return res.status(400).json({
                        success: false,
                        message: `Only ${product.stock} item(s) available in stock`
                    });
                }

                req.flash("error_msg", `Only ${product.stock} item(s) available in stock`);
                return res.redirect("/products");
            }

            existingItem.quantity = nextQuantity;
        } else {
            if (quantity > product.stock) {
                if (wantsJson(req)) {
                    return res.status(400).json({
                        success: false,
                        message: `Only ${product.stock} item(s) available in stock`
                    });
                }

                req.flash("error_msg", `Only ${product.stock} item(s) available in stock`);
                return res.redirect("/products");
            }

            cart.push({
                productId: String(product._id),
                quantity
            });
        }

        req.session.cart = cart;
        const cartCount = getCartCount(cart);

        if (wantsJson(req)) {
            return res.json({
                success: true,
                message: `${product.name} added to cart`,
                cartCount
            });
        }

        req.flash("success_msg", `${product.name} added to cart`);
        res.redirect("/products");
    } catch (error) {
        console.log(error);

        if (wantsJson(req)) {
            return res.status(500).json({ success: false, message: "Unable to add product to cart" });
        }

        req.flash("error_msg", "Unable to add product to cart");
        res.redirect("/products");
    }
};

const getCartPage = async (req, res) => {
    try {
        const cartDetails = await buildCartDetails(req);

        res.render("cart", {
            layout: false,
            ...cartDetails
        });
    } catch (error) {
        console.log(error);
        req.flash("error_msg", "Unable to load cart");
        res.redirect("/products");
    }
};

const updateCartItem = async (req, res) => {
    try {
        const { productId } = req.params;
        const requestedQuantity = Number.parseInt(req.body.quantity, 10);

        if (!Number.isInteger(requestedQuantity) || requestedQuantity < 1) {
            req.flash("error_msg", "Quantity must be at least 1");
            return res.redirect("/cart");
        }

        const product = await Product.findById(productId).select("stock");

        if (!product) {
            req.flash("error_msg", "Product no longer exists");
            return res.redirect("/cart");
        }

        if (requestedQuantity > product.stock) {
            req.flash("error_msg", `Only ${product.stock} item(s) available in stock`);
            return res.redirect("/cart");
        }

        const cart = getSessionCart(req);
        const item = cart.find((entry) => entry.productId === String(product._id));

        if (!item) {
            req.flash("error_msg", "Item not found in cart");
            return res.redirect("/cart");
        }

        item.quantity = requestedQuantity;
        req.session.cart = cart;

        req.flash("success_msg", "Cart updated successfully");
        res.redirect("/cart");
    } catch (error) {
        console.log(error);
        req.flash("error_msg", "Unable to update cart item");
        res.redirect("/cart");
    }
};

const removeCartItem = (req, res) => {
    const { productId } = req.params;
    const cart = getSessionCart(req);

    req.session.cart = cart.filter((item) => item.productId !== productId);
    req.flash("success_msg", "Item removed from cart");
    res.redirect("/cart");
};

const getCheckoutPage = async (req, res) => {
    try {
        const cartDetails = await buildCartDetails(req);

        res.render("checkout", {
            layout: false,
            ...cartDetails
        });
    } catch (error) {
        console.log(error);
        req.flash("error_msg", "Unable to load checkout page");
        res.redirect("/products");
    }
};

const placeOrderFromCheckout = async (req, res) => {
    try {
        const { shippingAddress } = req.body;
        const cart = getSessionCart(req);

        if (!shippingAddress || !shippingAddress.trim()) {
            req.flash("error_msg", "Please provide shipping address");
            return res.redirect("/checkout");
        }

        if (cart.length === 0) {
            req.flash("error_msg", "Your cart is empty");
            return res.redirect("/checkout");
        }

        const cartProductIds = cart.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: cartProductIds } });
        const productMap = new Map(products.map((product) => [String(product._id), product]));

        const orderItems = [];
        let totalAmount = 0;

        for (const item of cart) {
            const product = productMap.get(item.productId);

            if (!product) {
                req.flash("error_msg", "A product in your cart no longer exists");
                return res.redirect("/checkout");
            }

            if (item.quantity > product.stock) {
                req.flash("error_msg", `Only ${product.stock} item(s) available for ${product.name}`);
                return res.redirect("/checkout");
            }

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            totalAmount += product.price * item.quantity;
        }

        const order = new Order({
            user: req.session.user.id,
            items: orderItems,
            totalAmount,
            shippingAddress: shippingAddress.trim()
        });

        await order.save();

        for (const item of cart) {
            const product = productMap.get(item.productId);
            product.stock -= item.quantity;
            await product.save();
        }

        req.session.cart = [];

        req.flash("success_msg", "Order placed successfully");
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        req.flash("error_msg", "Failed to place order");
        res.redirect("/checkout");
    }
};

module.exports = {
    getProducts,
    addToCart,
    getCartPage,
    updateCartItem,
    removeCartItem,
    getCheckoutPage,
    placeOrderFromCheckout
};