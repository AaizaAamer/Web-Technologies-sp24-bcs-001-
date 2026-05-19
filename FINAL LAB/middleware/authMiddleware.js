exports.isLoggedIn = (req, res, next) => {

    if(!req.session.user){

        req.flash("error_msg", "Please login first");

        return res.redirect("/login");
    }

    next();
};

exports.isAdmin = (req, res, next) => {

    if(!req.session.user){

        req.flash("error_msg", "Please login first");

        return res.redirect("/login");
    }

    if(req.session.user.role !== "admin"){

        req.flash("error_msg", "Access Denied");

        return res.redirect("/");
    }

    next();
};