import userModel from "../models/userModel.js";

// add items to user cart
const addToCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await  userData.cartData;
        if (!cartData[req.body.itemId]) {
            cartData[req.body.itemId] = 1;
        } else {
            cartData[req.body.itemId] += 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Added To Cart"});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// remove items from user cart
const removeFromCart = async (req, res) => {
    try {
        let userData = await userModel.findById(req.body.userId);
        let cartData = await userData.cartData;
        if (cartData[req.body.itemId]>0) {
            cartData[req.body.itemId] -= 1;
        }
        await userModel.findByIdAndUpdate(req.body.userId,{cartData});
        res.json({success:true,message:"Removed From Cart"})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// fetch user cart data
const getCart = async (req, res) => {
    try {
        const userId = req.user.id; // Ensure userId is coming from authentication middleware
        const user = await userModel.findById(userId);

        // Debugging logs
        console.log("Fetched User:", user);

        // If user does not exist
        if (!user) {
            console.warn("User not found!");
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // If user.cartData is null, initialize it
        if (!user.cartData) {
            console.warn("cartData is null, initializing...");
            user.cartData = {}; // Set cartData as an empty object
            await user.save(); // Save updated user data
        }

        res.json({ success: true, cartData: user.cartData });

    } catch (error) {
        console.error("Error fetching cart:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export { addToCart, removeFromCart, getCart }