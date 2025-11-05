import express, { Router } from "express";
import { signup, login, logout } from "../controllers/authcontroller";

const authRouter: Router = express.Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", login);
authRouter.get("/logout", logout);

export default authRouter;
