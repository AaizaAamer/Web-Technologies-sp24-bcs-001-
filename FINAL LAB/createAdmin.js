const mongoose = require("mongoose");
const User = require("./models/User");

async function createAdmin() {
    await mongoose.connect("mongodb://127.0.0.1:27017/ecommerce");

    await User.deleteOne({ email: "admin@gmail.com" });

    await User.create({
        name: "Admin",
        email: "admin@gmail.com",
        password: "admin123",
        role: "admin"
    });

    console.log("Admin created with password: admin123");

    await mongoose.connection.close();
}

createAdmin().catch((error) => {
    console.log(error);
    mongoose.connection.close();
});