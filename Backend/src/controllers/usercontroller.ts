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
  try {
    const { assistantName, imageUrl } = req.body as {
      assistantName?: string;
      imageUrl?: string;
    };

    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing userId" });
    }

    if (!assistantName && !imageUrl && !(req as any).file) {
      return res.status(400).json({ message: "No update data provided" });
    }

    let assistantImage = imageUrl;

    // ✅ Cloudinary returns a string already
    if ((req as any).file) {
      const uploaded = await uploadOnCloudinary((req as any).file.path);
      if (uploaded) {
        assistantImage = uploaded;
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { assistantName, assistantImage },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      message: "Assistant updated successfully",
      user,
    });
  } catch (error) {
    console.error("Update Error:", error);
    return res.status(500).json({ message: "Update assistant Error" });
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




