const express = require("express");

const router = express.Router();

const upload =
require("../middleware/multer");

const {

    getDashboard,

    getAddProduct,

    addProduct,

    getEditProduct,

    editProduct,

    deleteProduct

} = require("../controllers/adminController");

router.get(
    "/dashboard",
    getDashboard
);

router.get(
    "/add",
    getAddProduct
);

router.post(
    "/add",
    upload.single("image"),
    addProduct
);

router.get(
    "/edit/:id",
    getEditProduct
);

router.post(
    "/edit/:id",
    upload.single("image"),
    editProduct
);

router.post(
    "/delete/:id",
    deleteProduct
);

module.exports = router;