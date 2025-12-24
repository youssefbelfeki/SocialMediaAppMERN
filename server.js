import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import User from "./routes/Users.js";
import Post from "./routes/Posts.js";
import Comment from "./routes/Comments.js";
import Notification from "./routes/Notifications.js";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const app = express();

// Create HTTP server
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(cookieParser());
app.use(express.json());

const userSockets = new Map();

app.use((req, res, next) => {
  req.io = io;
  req.userSockets = userSockets;
  next();
});

// Routes
app.use("/users", User);
app.use("/posts", Post);
app.use("/comments", Comment);
app.use("/notifications", Notification);

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User joins with their ID
  socket.on("user:join", (userId) => {
    userSockets.set(userId, socket.id);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on("disconnect", () => {
    // Remove user from map
    for (let [userId, socketId] of userSockets.entries()) {
      if (socketId === socket.id) {
        userSockets.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
    httpServer.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.log(err));

// Export for use in routes
export { io, userSockets };
