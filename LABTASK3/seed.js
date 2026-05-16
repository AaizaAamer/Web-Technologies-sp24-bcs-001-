const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");

const products = [

    {
        name: "Leather Hand Bag",
        price: 4500,
        category: "Fashion",
        rating: 4.5,
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
        rating: 4.7,
        stock: 15,
        image: "Earings.jpg"
    },

    {
        name: "Gold Necklace Set",
        price: 5500,
        category: "Jewelry",
        rating: 4.9,
        stock: 7,
        image: "Necklaces.jpg"
    },

    {
        name: "Wooden Wall Art",
        price: 4000,
        category: "Home Decor",
        rating: 4.2,
        stock: 5,
        image: "WallDecor.jpg"
    },

    {
        name: "Embroidery Pattern Kit",
        price: 1500,
        category: "Crafts",
        rating: 4.3,
        stock: 12,
        image: "EmbroideryPatterns.jpg"
    },

    {
        name: "Personalized Easter Basket",
        price: 2200,
        category: "Gifts",
        rating: 4.8,
        stock: 9,
        image: "EasterBaskets.jpg"
    },

    {
        name: "Kids Easter Outfit",
        price: 2800,
        category: "Fashion",
        rating: 4.4,
        stock: 14,
        image: "EasterOutfits.jpg"
    },

    {
        name: "Easter Treat Bag",
        price: 1200,
        category: "Gifts",
        rating: 4.6,
        stock: 18,
        image: "EasterTreats.jpg"
    },

    {
        name: "Wedding Gift Collection",
        price: 6000,
        category: "Gifts",
        rating: 5,
        stock: 4,
        image: "weddingGifts.jpg"
    },

    {
        name: "Personalized Cushion",
        price: 2700,
        category: "Home Decor",
        rating: 4.1,
        stock: 11,
        image: "PersonalizedHomeGifts.jpg"
    },

    {
        name: "Vintage Style Lamp",
        price: 4800,
        category: "Home Decor",
        rating: 4.5,
        stock: 6,
        image: "VintageStyleGifts.jpg"
    },

    {
        name: "Modern Art Prints",
        price: 1700,
        category: "Home Decor",
        rating: 4.2,
        stock: 20,
        image: "Prints.jpg"
    },

    {
        name: "Digital Landscape Artwork",
        price: 900,
        category: "Crafts",
        rating: 4.4,
        stock: 25,
        image: "DigitalPrints.jpg"
    },

    {
        name: "Diamond Ring",
        price: 7200,
        category: "Jewelry",
        rating: 5,
        stock: 3,
        image: "Rings.jpg"
    },

    {
        name: "Kids Toy Collection",
        price: 3500,
        category: "Toys",
        rating: 4.6,
        stock: 13,
        image: "Toys.jpg"
    },

    {
        name: "Party Decoration Kit",
        price: 2000,
        category: "Party",
        rating: 4.3,
        stock: 16,
        image: "PartySupplies.jpg"
    },

    {
        name: "Pet Accessories Set",
        price: 2600,
        category: "Pets",
        rating: 4.5,
        stock: 9,
        image: "PetGifts.jpg"
    },

    {
        name: "Fairy Tale Wall Artwork",
        price: 3100,
        category: "Crafts",
        rating: 4.7,
        stock: 7,
        image: "FairyTale.jpg"
    },

    {
        name: "Bold Blue Canvas Art",
        price: 2900,
        category: "Home Decor",
        rating: 4.4,
        stock: 10,
        image: "BoldBlueHues.jpg"
    },

    {
        name: "Purple Dream Painting",
        price: 3300,
        category: "Crafts",
        rating: 4.8,
        stock: 5,
        image: "SpectrumOfPurples.jpg"
    },

    {
        name: "Virtual Surrealism Poster",
        price: 1900,
        category: "Crafts",
        rating: 4.3,
        stock: 12,
        image: "VirtualSurrealism.jpg"
    },

    {
        name: "Pisces Zodiac Gift Box",
        price: 2400,
        category: "Gifts",
        rating: 4.6,
        stock: 10,
        image: "Pisces.jpg"
    },
    {
        name: "Handmade Crochet Basket",
        price: 2100,
        category: "Home Decor",
        rating: 4.5,
        stock: 9,
        image: "EasterBaskets.jpg"
    },

    {
        name: "Minimalist Gold Bracelet",
        price: 2600,
        category: "Jewelry",
        rating: 4.7,
        stock: 11,
        image: "Rings.jpg"
    },

    {
        name: "Floral Party Banner",
        price: 1400,
        category: "Party",
        rating: 4.2,
        stock: 15,
        image: "PartySupplies.jpg"
    },

    {
        name: "Custom Pet Name Tag",
        price: 1200,
        category: "Pets",
        rating: 4.8,
        stock: 20,
        image: "PetGifts.jpg"
    },

    {
        name: "Vintage Wooden Clock",
        price: 5200,
        category: "Home Decor",
        rating: 4.6,
        stock: 4,
        image: "VintageStyleGifts.jpg"
    },

    {
        name: "Boho Style Earrings",
        price: 1700,
        category: "Jewelry",
        rating: 4.3,
        stock: 17,
        image: "Earings.jpg"
    },

    {
        name: "Kids Birthday Decoration Box",
        price: 2900,
        category: "Party",
        rating: 4.7,
        stock: 8,
        image: "BirthdayGifts.jpg"
    },

    {
        name: "Abstract Purple Canvas",
        price: 3400,
        category: "Crafts",
        rating: 4.5,
        stock: 6,
        image: "SpectrumOfPurples.jpg"
    },

    {
        name: "Personalized Wedding Frame",
        price: 4300,
        category: "Gifts",
        rating: 4.9,
        stock: 5,
        image: "weddingGifts.jpg"
    },

    {
        name: "Luxury Leather Wallet",
        price: 3100,
        category: "Fashion",
        rating: 4.4,
        stock: 13,
        image: "BagsAndAccessories.jpg"
    }

];

async function seedData() {

    try {

        await Product.deleteMany();

        await Product.insertMany(products);

        console.log("Database Seeded Successfully");

        mongoose.connection.close();

    } catch (error) {

        console.log(error);

    }

}

seedData();