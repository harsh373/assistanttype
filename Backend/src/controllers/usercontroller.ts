import { Request, Response } from "express";
import User from "../models/usermodel";
import uploadOnCloudinary from "../config/clodinary";
import moment from "moment";
import geminiResponse from "../gemini";


export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ user });
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


export const updateAssistant = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { assistantName, imageUrl } = req.body as {
      assistantName?: string;
      imageUrl?: string;
    };

    const hasName = assistantName && assistantName.trim() !== "";
    const hasImageUrl = imageUrl && imageUrl.trim() !== "";
    const hasFile = Boolean((req as any).file);

    if (!hasName && !hasImageUrl && !hasFile) {
      return res.status(400).json({ message: "No valid update data provided" });
    }

    let assistantImage = imageUrl;

    if (hasFile) {
      const uploaded = await uploadOnCloudinary((req as any).file.path);
      if (!uploaded) {
        return res.status(500).json({ message: "Image upload failed" });
      }
      assistantImage = uploaded;
    }

    const updateFields: any = {};
    if (hasName) updateFields.assistantName = assistantName!.trim();
    if (assistantImage) updateFields.assistantImage = assistantImage;

    const user = await User.findByIdAndUpdate(userId, updateFields, {
      new: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Assistant updated successfully",
      user,
    });
  } catch (error) {
    console.error("updateAssistant error:", error);
    return res.status(500).json({ message: "Update assistant error" });
  }
};


export const askToAssistant = async (req: Request, res: Response) => {
  try {
    const command = req.body?.command;

    // 🚨 Hard input validation
    if (!command || typeof command !== "string" || !command.trim()) {
      return res.status(400).json({
        response: "Command is required and must be a non-empty string",
      });
    }

    const user = await User.findById((req as any).userId);
    if (!user) {
      return res.status(404).json({ response: "User not found" });
    }

    // Save clean history
    user.history.push(command.trim());
    await user.save();

    const userName = user.name;
    const assistantName = user.assistantName || "Assistant";

  
    const result = await geminiResponse(
      command.trim(),
      assistantName,
      userName
    );

 
    if (!result || typeof result !== "string") {
      console.error("Gemini invalid response:", result);
      return res.status(502).json({
        type: "general",
        userInput: command,
        response: "Assistant failed to respond. Try again.",
      });
    }


    const jsonMatch = result.match(/{[\s\S]*}/);

  
    if (!jsonMatch) {
      return res.json({
        type: "general",
        userInput: command,
        response: result,
      });
    }

    let gemResult: any;
    try {
      gemResult = JSON.parse(jsonMatch[0]);
    } catch (err) {
      console.error("JSON parse error:", jsonMatch[0]);
      return res.json({
        type: "general",
        userInput: command,
        response: result,
      });
    }

    const type = gemResult.type;

    switch (type) {
      case "get-date":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current date is ${moment().format("YYYY-MM-DD")}`,
        });

      case "get-time":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Current time is ${moment().format("hh:mm A")}`,
        });

      case "get-day":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `Today is ${moment().format("dddd")}`,
        });

      case "get-month":
        return res.json({
          type,
          userInput: gemResult.userInput,
          response: `This month is ${moment().format("MMMM")}`,
        });

      default:
        return res.json({
          type: type || "general",
          userInput: gemResult.userInput || command,
          response: gemResult.response || result,
        });
    }
  } catch (error) {
    console.error("askToAssistant error:", error);
    return res.status(500).json({
      response: "Assistant error. Please try again.",
    });
  }
};

