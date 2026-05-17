
const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { isAdmin } = require("../middleware/authMiddleware");

router.use(isAdmin);
const {
    getDashboard,
    showAddForm,
    addProduct,
    showEditForm,
    updateProduct,
    deleteProduct
} = require("../controllers/adminController");

router.get("/", getDashboard);

router.get("/add", showAddForm);

router.post("/add", upload.single("image"), addProduct);

router.get("/edit/:id", showEditForm);

router.post("/edit/:id", upload.single("image"), updateProduct);

router.post("/delete/:id", deleteProduct);

module.exports = router;