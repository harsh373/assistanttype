import express, { Router } from "express";
import multer from "multer";
import isAuth from "../middleware/isAuth";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/usercontroller";

const userRouter: Router = express.Router();
const upload = multer();

console.log("🟢 userRouter initialized");

// ✅ Get current logged-in user
userRouter.get("/current", isAuth, getCurrentUser);

// ✅ Update assistant (handles both FormData + JSON)
userRouter.post(
  "/update",
  isAuth,
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    console.log("🟠 /api/user/update hit — Content-Type:", contentType);

    // If the frontend sent a FormData request (real file upload)
    if (contentType.includes("multipart/form-data")) {
      console.log("📸 Using multer for file upload");
      upload.single("assistantImage")(req, res, next);
    } 
    // If the frontend sent JSON (like { assistantName, imageUrl })
    else {
      console.log("📦 Using express.json() for JSON parsing");
      express.json()(req, res, next);
    }
  },
  updateAssistant
);

// ✅ Ask the assistant
userRouter.post("/asktoassistant", isAuth, askToAssistant);

export default userRouter;

