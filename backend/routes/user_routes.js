import express from "express";
import * as usersData from "../data/users.js";
// import * as forums from "../data/forums.js";
// import * as posts from "../data/posts.js";
import { forums, posts } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const router = express.Router();
router.get("/:userId", async (req, res) => {
  try {
    const user = await usersData.getUserById(req.params.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.status(200).json(user);
  } catch (e) {
    console.error("Error fetching user:", e);
    res
      .status(500)
      .json({ error: "Internal server error while fetching user" });
  }
});

// routes/user_routes.js (add these routes)
router.get("/:userId/forums", async (req, res) => {
  try {
    const { userId } = req.params;

    // Convert userId to ObjectId if valid
    console.log("userId from user_routes for users/forums:", userId);
    let userIdObj;
    try {
      userIdObj = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    } catch (e) {
      userIdObj = userId;
    }

    const forumsCollection = await forums();
    const userForums = await forumsCollection
      .find({ createdBy: userIdObj })
      .sort({ createdAt: -1 })
      .toArray();

    console.log("userForums:", userForums);

    return res.json(userForums);
  } catch (error) {
    console.error("Error getting user forums:", error);
    return res.status(500).json({ error: "Failed to retrieve user forums" });
  }
});

router.get("/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;

    // Convert userId to ObjectId if valid
    console.log("userId from user_routes for users/posts:", userId);

    let userIdObj;
    try {
      userIdObj = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    } catch (e) {
      userIdObj = userId;
    }

    const postsCollection = await posts();
    const userPosts = await postsCollection
      .find({ authorId: new ObjectId(userId) })
      .sort({ createdAt: -1 })
      .toArray();

    // Get forum info for each post
    const forumsCollection = await forums();
    for (const post of userPosts) {
      const forum = await forumsCollection.findOne({ _id: post.forumId });
      post.forumTitle = forum ? forum.title : "Unknown Forum";
    }
    console.log("userPosts with forum titles:", userPosts);

    return res.json(userPosts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    return res.status(500).json({ error: "Failed to retrieve user posts" });
  }
});

export default router;
