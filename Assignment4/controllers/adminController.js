const Product = require("../models/Product");

const getDashboard = async (req, res) => {

    const products = await Product.find();

    res.render("admin/dashboard", {
        products
    });

};

const getAddProduct = (req, res) => {

    res.render("admin/addProduct");

};

const addProduct = async (req, res) => {

    const {
        name,
        price,
        stock,
        category
    } = req.body;

    await Product.create({

        name,
        price,
        stock,
        category,

        image:
        "/uploads/" + req.file.filename

    });

    res.redirect("/admin/dashboard");

};

const getEditProduct = async (req, res) => {

    const product =
    await Product.findById(req.params.id);

    res.render("admin/editProduct", {
        product
    });

};

const editProduct = async (req, res) => {

    const {
        name,
        price,
        stock,
        category
    } = req.body;

    let updatedData = {

        name,
        price,
        stock,
        category

    };

    if(req.file){

        updatedData.image =
        "/uploads/" + req.file.filename;

    }

    await Product.findByIdAndUpdate(
        req.params.id,
        updatedData
    );

    res.redirect("/admin/dashboard");

};

const deleteProduct = async (req, res) => {

    await Product.findByIdAndDelete(
        req.params.id
    );

    res.redirect("/admin/dashboard");

};

module.exports = {

    getDashboard,

    getAddProduct,

    addProduct,

    getEditProduct,

    editProduct,

    deleteProduct

};