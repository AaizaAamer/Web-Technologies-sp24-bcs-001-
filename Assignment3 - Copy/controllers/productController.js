const Product = require("../models/Product");

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

    res.render("products", {

        products,

        currentPage: page,

        totalPages,

        search,

        category,

        minPrice,

        maxPrice

    });

};

module.exports = {
    getProducts
};