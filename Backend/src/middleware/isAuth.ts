import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
   

    let token: string | undefined;

   
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
      console.log(" Token found in cookies.");
    }

    
    else if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
      console.log(" Token found in Authorization header.");
    }

    if (!token) {
      console.warn(" No token provided.");
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.userId = decoded.userId;
    console.log(" Token verified successfully for user:");

    next();
  } catch (error) {
    console.error(" isAuth error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default isAuth;
