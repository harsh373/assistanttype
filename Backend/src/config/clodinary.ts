import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

// Define the function type — it takes a file path and returns a Promise<string>
const uploadOnCloudinary = async (filePath: string): Promise<string | null> => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
    


  try {
    const uploadResult = await cloudinary.uploader.upload(filePath);
    fs.unlinkSync(filePath); // delete the local file after upload
    return uploadResult.secure_url; // return the Cloudinary URL
  } catch (error) {
    fs.unlinkSync(filePath);
    console.error("Cloudinary upload error:", error);
    return null; // safer to return null instead of using res here
  }
};

export default uploadOnCloudinary;
