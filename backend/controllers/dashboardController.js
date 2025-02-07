import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import couponModel from "../models/couponModel.js";

// Dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // ✅ Orders statistics
        const totalOrders = await orderModel.countDocuments({});
        const pendingOrders = await orderModel.countDocuments({ status: "Food Processing" });
        const completedOrders = await orderModel.countDocuments({ status: "Delivered" });

        const totalRevenue = await orderModel.aggregate([
            { $match: { status: "Delivered" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        const revenue = totalRevenue.length > 0 ? totalRevenue[0].total : 0;
        const averageOrderValue = totalOrders > 0 ? (revenue / totalOrders).toFixed(2) : 0;

        // ✅ User statistics
        const totalUsers = await userModel.countDocuments({});
        const newUsers = await userModel.countDocuments({
            createdAt: { $gte: new Date(new Date().setDate(new Date().getDate() - 30)) }
        });

        const repeatCustomers = await orderModel.aggregate([
            { $group: { _id: "$userId", orderCount: { $sum: 1 } } },
            { $match: { orderCount: { $gt: 1 } } },
            { $count: "repeatCustomers" }
        ]);
        const repeatCustomerCount = repeatCustomers.length > 0 ? repeatCustomers[0].repeatCustomers : 0;

        // ✅ Inventory statistics
        const totalFoodItems = await foodModel.countDocuments({}); // Fix: Define totalFoodItems

        // Fetch all sold items sorted by count
        const allSoldItems = await orderModel.aggregate([
            { $unwind: "$items" },
            { $group: { _id: "$items.name", count: { $sum: "$items.quantity" } } },
            { $sort: { count: -1 } }
        ]);

        // Get the top 5 selling items
        const mostSoldItems = allSoldItems.slice(0, 5);

        // Get the bottom 5 selling items **excluding those already in mostSoldItems**
        const leastSoldItems = allSoldItems
            .filter(item => !mostSoldItems.some(mostSold => mostSold._id === item._id))
            .slice(-5);

        // ✅ Coupons statistics
        const totalCouponsUsed = await orderModel.countDocuments({ couponCode: { $exists: true, $ne: "" } });

        const mostUsedCoupons = await orderModel.aggregate([
            { $match: { couponCode: { $exists: true, $ne: "" } } },
            { $group: { _id: "$couponCode", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        const unusedCoupons = await couponModel.countDocuments({ usedBy: { $size: 0 } });

        // ✅ Response data
        res.json({
            success: true,
            data: {
                orders: { totalOrders, pendingOrders, completedOrders, revenue, averageOrderValue },
                users: { totalUsers, newUsers, repeatCustomerCount },
                inventory: { totalFoodItems, mostSoldItems, leastSoldItems },
                coupons: { totalCouponsUsed, mostUsedCoupons, unusedCoupons }
            }
        });

    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ success: false, message: "Error fetching dashboard statistics" });
    }
};
