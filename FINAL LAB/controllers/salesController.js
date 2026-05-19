const Order = require("../models/Order");

/* =========================
   GET SALES DATA (Aggregation)
========================= */

// Helper function to calculate sales statistics
const calculateSalesStats = async () => {
    try {
        // Total Revenue - sum of all order totalAmounts
        const revenueData = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        // Total Orders - count of all orders
        const totalOrders = await Order.countDocuments();

        // Top-Selling Product - using aggregation to find most ordered product
        const topSellingData = await Order.aggregate([
            {
                $unwind: "$items"
            },
            {
                $group: {
                    _id: "$items.product",
                    totalQuantity: { $sum: "$items.quantity" },
                    totalSales: { $sum: "$items.price" }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            }
        ]);

        // Extract top-selling products
        const topSellingProducts = topSellingData.map(item => ({
            productId: item._id,
            productName: item.productInfo[0]?.name || "Unknown Product",
            quantitySold: item.totalQuantity,
            totalSales: item.totalSales
        }));

        // Recent transactions (last 10 orders)
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate("user", "name email")
            .populate("items.product", "name price");

        return {
            totalRevenue: Math.round(totalRevenue * 100) / 100,
            totalOrders,
            topSellingProducts,
            recentOrders,
            timestamp: new Date()
        };
    } catch (error) {
        console.error("Error calculating sales stats:", error);
        return {
            totalRevenue: 0,
            totalOrders: 0,
            topSellingProducts: [],
            recentOrders: [],
            timestamp: new Date(),
            error: error.message
        };
    }
};

const formatRecentOrders = (orders = []) => {
    return orders.map((order) => ({
        _id: order._id,
        userName: order.user?.name || "Unknown User",
        userEmail: order.user?.email || "N/A",
        totalAmount: order.totalAmount,
        createdAt: order.createdAt,
        itemCount: Array.isArray(order.items) ? order.items.length : 0
    }));
};

/* =========================
   RENDER SALES DASHBOARD
========================= */

exports.renderSalesDashboard = async (req, res) => {
    try {
        const salesData = await calculateSalesStats();
        const normalizedSalesData = {
            ...salesData,
            recentOrders: formatRecentOrders(salesData.recentOrders)
        };

        res.render("sales", {
            layout: false,
            title: "Sales Dashboard",
            salesData: normalizedSalesData
        });
    } catch (error) {
        console.error("Error rendering sales dashboard:", error);
        res.status(500).render("404", {
            layout: false,
            message: "Error loading sales dashboard"
        });
    }
};

/* =========================
   API: GET SALES DATA (JSON)
========================= */

exports.getSalesDataAPI = async (req, res) => {
    try {
        const salesData = await calculateSalesStats();

        res.json({
            success: true,
            data: {
                totalRevenue: salesData.totalRevenue,
                totalOrders: salesData.totalOrders,
                topSellingProducts: salesData.topSellingProducts,
                recentOrders: formatRecentOrders(salesData.recentOrders)
            },
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Error fetching sales data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching sales data",
            error: error.message
        });
    }
};
