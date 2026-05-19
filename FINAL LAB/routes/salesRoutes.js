const express = require("express");
const router = express.Router();

const {
    renderSalesDashboard,
    getSalesDataAPI
} = require("../controllers/salesController");

const { isAdmin } = require("../middleware/authMiddleware");

/* =========================
   SALES ROUTES (Admin Only)
========================= */

// GET /sales - Render Sales Dashboard with initial data (Admin only)
router.get("/sales", isAdmin, renderSalesDashboard);

// GET /api/sales-data - API endpoint for real-time data (JSON) (Admin only)
router.get("/api/sales-data", isAdmin, getSalesDataAPI);

module.exports = router;
