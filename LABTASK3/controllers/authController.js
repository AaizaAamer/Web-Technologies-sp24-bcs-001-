// const User = require("../models/User");
// const bcrypt = require("bcryptjs");

// exports.showRegister = (req, res) => {
//     res.render("auth/register");
// };

// exports.registerUser = async (req, res) => {

//     try{

//         const { name, email, password } = req.body;

//         const existingUser = await User.findOne({ email });

//         if(existingUser){

//             req.flash("error_msg", "Email already exists");

//             return res.redirect("/register");
//         }

//         const user = new User({
//             name,
//             email,
//             password
//         });

//         await user.save();

//         req.flash("success_msg", "Registration successful");

//         res.redirect("/login");

//     }catch(error){

//         console.log(error);
//     }
// };

// exports.showLogin = (req, res) => {
//     res.render("auth/login");
// };

// exports.loginUser = async (req, res) => {

//     try{

//         const { email, password } = req.body;

//         const user = await User.findOne({ email });

//         if(!user){

//             req.flash("error_msg", "Invalid email or password");

//             return res.redirect("/login");
//         }

//         const isMatch = await bcrypt.compare(password, user.password);

//         if(!isMatch){

//             req.flash("error_msg", "Invalid email or password");

//             return res.redirect("/login");
//         }

//         req.session.user = {
//             id: user._id,
//             name: user.name,
//             role: user.role
//         };

//         req.flash("success_msg", `Welcome back ${user.name}`);

//         if(user.role === "admin"){
//             return res.redirect("/admin");
//         }

//         res.redirect("/");

//     }catch(error){

//         console.log(error);
//     }
// };

// exports.logoutUser = (req, res) => {

//     req.session.destroy(() => {

//         req.flash("success_msg", "Logged out successfully");

//         res.redirect("/login");
//     });
// };

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* REGISTER PAGE */
exports.showRegister = (req, res) => {
    res.render("auth/register");
};

/* REGISTER USER */
exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : "";
        const normalizedName = name ? name.trim() : "";

        console.log("REGISTER BODY:", req.body);

        if (!normalizedName || !normalizedEmail || !password) {
            req.flash("error_msg", "All fields are required");
            return res.redirect("/register");
        }

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            req.flash("error_msg", "Email already exists");
            return res.redirect("/register");
        }

        const user = new User({ name: normalizedName, email: normalizedEmail, password });
        await user.save();

        req.flash("success_msg", "Registered successfully. Please login.");
        res.redirect("/login");

    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Something went wrong");
        res.redirect("/register");
    }
};

/* LOGIN PAGE */
exports.showLogin = (req, res) => {
    res.render("auth/login");
};

/* LOGIN USER */
exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const normalizedEmail = email ? email.trim().toLowerCase() : "";

        if (!normalizedEmail || !password) {
            req.flash("error_msg", "All fields are required");
            return res.redirect("/login");
        }

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            req.flash("error_msg", "Invalid credentials");
            return res.redirect("/login");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            req.flash("error_msg", "Invalid credentials");
            return res.redirect("/login");
        }

        req.session.user = {
            id: user._id,
            name: user.name,
            role: user.role
        };

        req.flash("success_msg", `Welcome ${user.name}`);

        return user.role === "admin"
            ? res.redirect("/admin")
            : res.redirect("/");

    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Login error");
        res.redirect("/login");
    }
};

/* LOGOUT */
exports.logoutUser = (req, res) => {
    if (req.session) {
        req.session.user = null;
        req.flash("success_msg", "You have successfully logged out");
        req.session.save((err) => {
            if (err) console.log(err);
            res.redirect("/login");
        });
        return;
    }

    res.redirect("/login");
};

/* PROFILE PAGE */
exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).select("name email role");

        if (!user) {
            req.flash("error_msg", "User not found");
            return res.redirect("/login");
        }

        res.render("auth/profile", { profileUser: user });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Unable to load profile");
        res.redirect("/");
    }
};