
const Product = require("../models/Product");

const getDashboard = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1;
        const limit = 5;

        const skip = (page - 1) * limit;

        const search = req.query.search;

        let query = {};

        if (search && search.trim()) {
            query.name = { $regex: search.trim(), $options: "i" };
        }

        const products = await Product.find(query)
            .skip(skip)
            .limit(limit);

        const totalProducts = await Product.countDocuments(query);

        const totalPages = Math.ceil(totalProducts / limit);

        res.render("admin/dashboard", {
            products,
            currentPage: page,
            totalPages
        });

    } catch (error) {
        console.log(error);
    }
};
const showAddForm = (req, res) => {

    res.render("admin/addProduct");

};

const addProduct = async (req, res) => {

    try {

        const {
            name,
            price,
            category,
            rating,
            stock
        } = req.body;

        if (!name || !price || !category || !rating || !stock) {
            if (price < 0 || stock < 0) {

    return res.send("Price and Stock cannot be negative");

}

if (rating < 0 || rating > 5) {

    return res.send("Rating must be between 0 and 5");

}

            return res.send("All fields are required");

        }

        const newProduct = new Product({

            name,
            price,
            category,
            rating,
            stock,
            image: req.file.filename

        });

        await newProduct.save();

        res.redirect("/admin");

    }
    
    catch (error) {

        console.log(error);

    }

};

const showEditForm = async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        res.render("admin/editProduct", { product });

    }
    
    catch (error) {

        console.log(error);

    }

};
const updateProduct = async (req, res) => {
    try {

        const { name, price, category, rating, stock } = req.body;

        if (!name || !price || !category || !rating || !stock) {
            return res.send("All fields are required");
        }

        if (price < 0 || stock < 0) {
            return res.send("Price and Stock cannot be negative");
        }

        if (rating < 0 || rating > 5) {
            return res.send("Rating must be between 0 and 5");
        }

        let updatedData = {
            name,
            price,
            category,
            rating,
            stock
        };

        if (req.file) {
            updatedData.image = req.file.filename;
        }

        await Product.findByIdAndUpdate(req.params.id, updatedData);

        res.redirect("/admin");

    } catch (error) {
        console.log(error);
    }
};
const deleteProduct = async (req, res) => {

    try {

        await Product.findByIdAndDelete(req.params.id);

        res.redirect("/admin");

    }
    
    catch (error) {

        console.log(error);

    }

};

module.exports = {

    getDashboard,
    showAddForm,
    addProduct,
    showEditForm,
    updateProduct,
    deleteProduct

};