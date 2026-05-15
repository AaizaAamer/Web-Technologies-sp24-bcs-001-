const mongoose = require("mongoose");

const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");

const products = [

    {
        name: "Leather Hand Bag",
        price: 4500,
        category: "Fashion",
        rating: 4,
        stock: 10,
        image: "BagsAndAccessories.jpg"
    },

    {
        name: "Birthday Surprise Box",
        price: 2500,
        category: "Gifts",
        rating: 5,
        stock: 8,
        image: "BirthdayGifts.jpg"
    },

    {
        name: "Modern Table Decor",
        price: 3200,
        category: "Home Decor",
        rating: 4,
        stock: 6,
        image: "Decor.jpg"
    },

    {
        name: "Pearl Earrings",
        price: 1800,
        category: "Jewelry",
        rating: 5,
        stock: 15,
        image: "Earings.jpg"
    },

    {
        name: "Gold Necklace Set",
        price: 5500,
        category: "Jewelry",
        rating: 5,
        stock: 7,
        image: "Necklaces.jpg"
    },

    {
        name: "Wooden Wall Art",
        price: 4000,
        category: "Home Decor",
        rating: 4,
        stock: 5,
        image: "WallDecor.jpg"
    },

    {
        name: "Embroidery Pattern Kit",
        price: 1500,
        category: "Crafts",
        rating: 4,
        stock: 12,
        image: "EmbroideryPatterns.jpg"
    }

];

const extraProducts = [];

for(let i = 1; i <= 23; i++){

    const baseProduct = products[i % products.length];

    extraProducts.push({

        name: `${baseProduct.name} ${i}`,

        price: baseProduct.price + (i * 100),

        category: baseProduct.category,

        rating: baseProduct.rating,

        stock: baseProduct.stock + i,

        image: baseProduct.image

    });

}

const finalProducts = [...products, ...extraProducts];

async function seedData(){

    await Product.deleteMany();

    await Product.insertMany(finalProducts);

    console.log("Database Seeded");

    mongoose.connection.close();

}

seedData();