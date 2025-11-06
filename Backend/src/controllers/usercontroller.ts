import { Request, Response } from "express";
import User from "../models/usermodel";
import uploadOnCloudinary from "../config/clodinary";
import moment from "moment";
import geminiResponse from "../gemini";





export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const user = await User.findById(userId).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ user });       
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });  
    }
    
}

export const updateAssistant = async (req: Request, res: Response) => {
  console.log("🟢 [updateAssistant] — Handler triggered");

  try {
    const userId = (req as any).userId;
    console.log("🔍 userId:", userId);

    if (!userId) {
      console.log("❌ Missing userId — unauthorized request");
      return res.status(401).json({ message: "Unauthorized: missing userId" });
    }

    console.log("📦 Request body:", req.body);
    console.log("📸 Uploaded file:", (req as any).file);

    const { assistantName, imageUrl } = req.body as {
      assistantName?: string;
      imageUrl?: string;
    };

    // Defensive guard
    if (!assistantName && !imageUrl && !(req as any).file) {
      console.log("⚠️ No valid update data provided");
      return res.status(400).json({ message: "No valid update data provided" });
    }

    let assistantImage = imageUrl;

    // ✅ Upload new image to Cloudinary (if exists)
    if ((req as any).file) {
      console.log("☁️ Uploading new assistant image to Cloudinary...");
      const uploadedUrl = await uploadOnCloudinary((req as any).file.path);
      console.log("☁️ Cloudinary upload result:", uploadedUrl);
      if (uploadedUrl) assistantImage = uploadedUrl;
    }

    // ✅ Build update object
    const updateFields: Record<string, any> = {};
    if (assistantName?.trim()) updateFields.assistantName = assistantName.trim();
    if (assistantImage?.trim()) updateFields.assistantImage = assistantImage.trim();

    console.log("🛠️ Prepared updateFields:", updateFields);

    if (Object.keys(updateFields).length === 0) {
      console.log("⚠️ Nothing to update, skipping DB update");
      return res.status(400).json({ message: "Nothing to update" });
    }

    console.log("🧩 Updating user in database...");
    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    if (!user) {
      console.log("❌ User not found in database");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("✅ Assistant updated successfully:", {
      id: user._id,
      name: user.assistantName,
      image: user.assistantImage,
    });

    return res.status(200).json({
      message: "Assistant updated successfully",
      user,
    });
  } catch (error) {
    console.error("🔥 Catch block triggered — Update Error:");
    console.error(error);
    return res.status(500).json({ message: "Update assistant Error", error });
  }
};



export const askToAssistant = async (req: Request, res: Response) => {
    try {
        const { command } = req.body as {command:string};
        const user = await User.findById((req as any).userId);

        if (!user) {
            return res.status(404).json({ response: "User not found" });
        }

        user.history.push(command);
        await user.save();

        const userName: string = user.name;
        const assistantName: string = user.assistantName ||"Assistant";

        const result: string = await geminiResponse(command, assistantName, userName);

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ response: "sorry, I can't understand" });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        console.log(gemResult);

        const type: string = gemResult.type;

        switch (type) {
            case "get-date":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current date is ${moment().format("YYYY-MM-DD")}`,
                });

            case "get-time":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `current time is ${moment().format("hh:mm A")}`,
                });

            case "get-day":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("dddd")}`,
                });

            case "get-month":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: `today is ${moment().format("MMMM")}`,
                });

            case "google-search":
            case "chatgpt-search":
            case "youtube-search":
            case "youtube-play":
            case "general":
            case "calculator-open":
            case "instagram-open":
            case "facebook-open":
            case "weather-show":
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response,
                });

            default:
                return res.status(400).json({ response: "I didn't understand that command." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: "ask assistant error" });
    }
};




