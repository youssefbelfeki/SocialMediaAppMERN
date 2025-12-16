import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import User from "./routes/Users.js";
import Post from "./routes/Posts.js";
import Comment from "./routes/Comments.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Routes
app.use("/users", User);
app.use("/posts", Post);
app.use("/comments", Comment);

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));
