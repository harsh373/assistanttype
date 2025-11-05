import User from "../models/usermodel";
import validator from "validator";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import genToken from "../config/token";





export const signup = (async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body as {
            name : string,
            email : string,
            password : string  
        }
        
        const existuser = await User.findOne({ email });
        if (existuser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const validEmail = validator.isEmail(email);
        if (!validEmail) {
            console.log("Invalid Email Format");
            return res.status(400).json({ message: "Invalid Email Format" });
        }

        if (password.length < 7) {
            console.log("Password must be at least 7 characters long");
            return res.status(400).json({ message: "Password must be at least 7 characters long" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            name,
            password: hashedPassword,
            email
        })

        const token = await genToken(user._id as string);
       
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(201).json({ message: "User created successfully", user, token });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body as {
            email: string,
            password: string
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = await genToken(user._id as string);
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })
        return res.status(200).json({ message: "Login successful", user, token });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            sameSite: "strict",
            secure: false
        });
        return res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    } 
}