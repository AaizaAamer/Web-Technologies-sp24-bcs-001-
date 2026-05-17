const Product = require("../models/Product");
const Order = require("../models/Order");

const getSessionCart = (req) => {
    if (!Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }

    return req.session.cart;
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

    const cartCount = getSessionCart(req).reduce((sum, item) => sum + item.quantity, 0);

    res.render("products", {

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

        const product = await Product.findById(productId);

        if (!product) {
            req.flash("error_msg", "Product not found");
            return res.redirect("/products");
        }

        if (product.stock < 1) {
            req.flash("error_msg", "This product is out of stock");
            return res.redirect("/products");
        }

        const cart = getSessionCart(req);
        const existingItem = cart.find((item) => item.productId === String(product._id));

        if (existingItem) {
            if (existingItem.quantity >= product.stock) {
                req.flash("error_msg", `Only ${product.stock} item(s) available in stock`);
                return res.redirect("/products");
            }

            existingItem.quantity += 1;
        } else {
            cart.push({
                productId: String(product._id),
                quantity: 1
            });
        }

        req.session.cart = cart;
        req.flash("success_msg", `${product.name} added to cart`);
        res.redirect("/products");
    } catch (error) {
        console.log(error);
        req.flash("error_msg", "Unable to add product to cart");
        res.redirect("/products");
    }
};

const getCheckoutPage = async (req, res) => {
    try {
        const cart = getSessionCart(req);

        if (cart.length === 0) {
            return res.render("checkout", {
                cartItems: [],
                totalAmount: 0,
                cartCount: 0
            });
        }

        const cartProductIds = cart.map((item) => item.productId);
        const products = await Product.find({ _id: { $in: cartProductIds } }).select("name price stock");
        const productMap = new Map(products.map((product) => [String(product._id), product]));

        const cartItems = [];
        let totalAmount = 0;

        for (const item of cart) {
            const product = productMap.get(item.productId);

            if (!product) {
                continue;
            }

            const lineTotal = product.price * item.quantity;
            totalAmount += lineTotal;

            cartItems.push({
                product,
                quantity: item.quantity,
                lineTotal
            });
        }

        res.render("checkout", {
            cartItems,
            totalAmount,
            cartCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
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
    getCheckoutPage,
    placeOrderFromCheckout
};