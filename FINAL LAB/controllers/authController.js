

const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* REGISTER PAGE */
exports.showRegister = (req, res) => {
    res.render("auth/register", { layout: false });
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
    res.render("auth/login", { layout: false });
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
    if (!req.session) {
        return res.redirect("/login");
    }

    req.session.destroy((err) => {
        if (err) {
            console.log(err);
        }

        res.clearCookie("connect.sid");
        res.redirect("/login");
    });
};

/* PROFILE PAGE */
exports.showProfile = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.id).select("name email role");

        if (!user) {
            req.flash("error_msg", "User not found");
            return res.redirect("/login");
        }

        res.render("auth/profile", { layout: false, profileUser: user });
    } catch (err) {
        console.log(err);
        req.flash("error_msg", "Unable to load profile");
        res.redirect("/");
    }
};