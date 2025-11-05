import express, { Router } from "express"
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/usercontroller"
import isAuth from "../middleware/isAuth"
import upload from "../middleware/multerfile"

const userRouter:Router=express.Router()

userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistant)
userRouter.post("/asktoassistant",isAuth,askToAssistant)

export default userRouter