import express from "express";
import Coupon from "../models/couponModel.js";
import authMiddleware from "../middleware/auth.js";
const router = express.Router();

// 1️⃣ Create a new coupon (Admin Only)
router.post("/create", authMiddleware, async (req, res) => {
  try {
    // Ensure only admins can create coupons (Modify as per your user schema)
    if (req.user.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }

    const { code, discount, expiry, usageLimit } = req.body;

    // Ensure coupon codes are case-insensitive
    const existingCoupon = await Coupon.findOne({ code: new RegExp("^" + code + "$", "i") });

    if (existingCoupon) {
      return res.status(400).json({ success: false, message: "Coupon already exists" });
    }

    const newCoupon = new Coupon({
      code: code.toUpperCase(), // Store coupon codes in uppercase for consistency
      discount,
      expiry,
      usageLimit,
      usedBy: [],
    });

    await newCoupon.save();
    res.json({ success: true, message: "Coupon created successfully", coupon: newCoupon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error creating coupon" });
  }
});

// 2️⃣ Validate Coupon (User Applies a Coupon)
router.post("/validate", async (req, res) => {
    try {
        const { code } = req.body;
        console.log("Received Coupon Code:", code); // Debugging

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });
        console.log("Found Coupon:", coupon); // Debugging

        if (!coupon) {
            console.log("Coupon not found in database!");
            return res.status(404).json({ success: false, message: "Invalid coupon" });
        }

        // Check expiry date
        if (new Date() > new Date(coupon.expiry)) {
            console.log("Coupon expired on:", coupon.expiry);
            return res.status(400).json({ success: false, message: "Coupon expired" });
        }

        // Check usage limit
        if (coupon.usedBy.length >= coupon.usageLimit) {
            console.log("Usage limit reached:", coupon.usageLimit);
            return res.status(400).json({ success: false, message: "Coupon usage limit exceeded" });
        }

        res.json({ success: true, discount: coupon.discount });
    } catch (error) {
        console.error("Error in validation:", error);
        res.status(500).json({ success: false, message: "Error validating coupon" });
    }
});
  

// 3️⃣ Apply Coupon to Order (On Checkout)
router.post("/apply", authMiddleware, async (req, res) => {
  try {
    const { code, userId } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid coupon" });
    }

    // Ensure the coupon is still valid
    if (new Date() > new Date(coupon.expiry)) {
      return res.status(400).json({ success: false, message: "Coupon expired" });
    }

    // Check if the user has already used this coupon
    if (coupon.usedBy.includes(userId)) {
      return res.status(400).json({ success: false, message: "You have already used this coupon" });
    }

    // Check if the usage limit has been reached
    if (coupon.usedBy.length >= coupon.usageLimit) {
      return res.status(400).json({ success: false, message: "Coupon usage limit exceeded" });
    }

    // Add user to usedBy list and save coupon
    coupon.usedBy.push(userId);
    await coupon.save();

    res.json({ success: true, message: "Coupon applied successfully", discount: coupon.discount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error applying coupon" });
  }
});

export default router;
