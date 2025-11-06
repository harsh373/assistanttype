import User from "../models/usermodel";
import validator from "validator";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import genToken from "../config/token";

// ---------------- SIGNUP ----------------
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body as {
      name: string;
      email: string;
      password: string;
    };

    // Check existing user
    const existUser = await User.findOne({ email });
    if (existUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validate password
    if (password.length < 7) {
      return res
        .status(400)
        .json({ message: "Password must be at least 7 characters long" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = await genToken(user._id as string);

    // ✅ Set cookie properly for cross-origin (frontend <-> backend)
    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // Vercel uses HTTPS
      sameSite: "none", // Required for cross-site requests
      path: "/", // 🩵 critical
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      message: "User created successfully",
      user,
      token,
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- LOGIN ----------------
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as {
      email: string;
      password: string;
    };

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = await genToken(user._id as string);

    // ✅ Set cookie properly for cross-origin
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user,
      token,
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req: Request, res: Response) => {
  try {
    // ✅ Clear cookie correctly (must match same options)
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
