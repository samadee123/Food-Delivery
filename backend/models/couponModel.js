import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // Percentage discount (e.g., 10 for 10%)
  expiry: { type: Date, required: true }, // Expiry date for coupon
  usageLimit: { type: Number, default: 1 }, // How many times a coupon can be used
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }] // Track users who used this coupon
});

export default mongoose.model("Coupon", couponSchema);
