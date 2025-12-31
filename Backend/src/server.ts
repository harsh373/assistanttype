import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";
import authRouter from "./routes/authroutes";
import userRouter from "./routes/userroutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.set("trust proxy", 1);


app.use(
  cors({
    origin: 
      "https://assistant-neon.vercel.app",
       credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());


app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the TypeScript backend server!");
});

const PORT = process.env.PORT || 5000;


connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" MongoDB connection failed:", err);
  });
