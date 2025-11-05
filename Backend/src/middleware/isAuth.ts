import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const isAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(400).json({ message: "token not found" });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };
    req.userId = verifyToken.userId;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "is Auth error" });
  }
};

export default isAuth;
