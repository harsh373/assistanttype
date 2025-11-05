import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL as string);
    console.log("database connected successfully");
  } catch (error) {
    console.log(error);
  }
};

export default connectDb;