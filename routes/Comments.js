import express from "express";
import Comments from "../models/Comments.js";
import { authMiddleware } from "../middleware/AuthMiddleware.js";

const router = express.Router();

// Add Comment to a Post
router.post("/:postId", authMiddleware, async (req, res) => {
  try {
    const post = await Commnets.findById(req.params.postId);

    const comment = new Comments({
      text,
      user: req.user.id,
      post: req.params.postId,
    });

    await comment.save();

    const populated = await comment.populate("user", "name avatar");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Comments for a Post
router.get("/:postId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comments.find({ post: req.params.postId })
      .populate("user", "name avatar")
      .populate("replies.user", "name avatar")
      .sort({ createdAt: -1 });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add reply to a Comment
router.post("/reply/:commentId", authMiddleware, async (req, res) => {
  try {
    const comment = await Comments.findById(req.params.commentId);

    comment.replies.push({ user: req.user.id, text });
    await comment.save();
    const populated = await comment.populate("replies.user", "name avatar");

    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Comment Count for a Post
router.get("/count/:postId", authMiddleware, async (req, res) => {
  try {
    const count = await Comments.countDocuments({ post: req.params.postId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
