import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import { NextFunction, Request, Response } from "express";
import mongoose, { ConnectOptions, connect } from "mongoose";
import authRoutes from "./routes/routes";
import errorMiddleware from "./middleware/error.middleware";
const app = express();
dotenv.config();
app.use("/", express.static("public/images"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({}));
app.get("/", (req: Request, res: Response) => {
  return res.send("hello niggers");
});
app.use(authRoutes);
app.use(errorMiddleware);

const connectDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to database");
    app.listen(process.env.PORT, () => {
      console.log("Server is running on port ", process.env.PORT);
    });
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};
process.on("uncaughtException", (error, source) => {
  console.log("uncaughtException", error);
  process.exit(1);
});
process.on("unhandledRejection", (error, source) => {
  console.log("unhandledRejection", error);
  process.exit(1);
});
connectDatabase();
