import express, { Router } from "express"
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/usercontroller"
import isAuth from "../middleware/isAuth"
import upload from "../middleware/multerfile"

const userRouter:Router=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)

userRouter.post(
  "/update",
  isAuth,
  (req, res, next) => {
    const contentType = req.headers["content-type"] || "";
    if (contentType.startsWith("multipart/form-data")) {
      // run multer only if the request actually contains a file
      upload.single("assistantImage")(req, res, next);
    } else {
      // skip multer if frontend sends JSON
      next();
    }
  },
  updateAssistant
);
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter
