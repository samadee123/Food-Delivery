import mongoose from "mongoose";

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://samadee:samadee123@cluster0.nqqyu.mongodb.net/food-del').then(()=>console.log("DB Connected"));
}