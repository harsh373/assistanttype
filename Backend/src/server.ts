import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db";

import { connect } from "http2";
import authRouter from "./routes/authroutes";
import userRouter from "./routes/userroutes";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174","https://assistant-neon.vercel.app"], // ✅ add both
    credentials: true,
  })
);
const PORT = process.env.PORT || 5000;




app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);


app.get("/", (req: Request, res: Response) => {
  res.send("Hello from the TypeScript backend server!");
});



app.listen(PORT, () => {
    connectDb();
  console.log(`Server is running on port ${PORT}`);
});






