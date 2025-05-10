
import express from "express";
import * as forumsData from "../data/forums.js";
import * as postsData from "../data/posts.js";

const router = express.Router({ mergeParams: true });

const ensureAuthenticated = (req, res, next) => {
  if (!req.session.user) {
    return res.status(401).json({ error: "Authentication required" });
  }
  next();
};

router.get("/", ensureAuthenticated, async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!universityId || typeof universityId !== "string") {
      return res.status(400).json({ error: "Invalid university ID" });
    }

    const forums = await forumsData.getForumsByUniversity(universityId);
    return res.json(forums);
  } catch (error) {
    console.error("Error getting forums:", error);
    return res.status(500).json({ error: "Failed to retrieve forums" });
  }
});

router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    const { title, tags } = req.body;
    const { universityId } = req.params;
    const createdBy = req.session.user._id;

    const newForum = await forumsData.createForum(
      universityId,
      title,
      tags,
      createdBy
    );

    return res.status(201).json(newForum);
  } catch (error) {
    console.error("Error creating forum:", error);
    return res
      .status(400)
      .json({ error: error.message || "Failed to create forum" });
  }
});

router.get("/:forumId", async (req, res) => {
  try {
    const { forumId } = req.params;
    const forum = await forumsData.getForumById(forumId);
    return res.json(forum);
  } catch (error) {
    console.error("Error getting forum:", error);
    return res.status(404).json({ error: "Forum not found" });
  }
});

router.get("/:forumId/posts", ensureAuthenticated, async (req, res) => {
  try {
    const { forumId } = req.params;
    const posts = await postsData.getPostsByForum(forumId);
    return res.json(posts);
  } catch (error) {
    console.error("Error getting posts:", error);
    return res
      .status(400)
      .json({ error: error.message || "Failed to retrieve posts" });
  }
});

router.post("/:forumId/posts", ensureAuthenticated, async (req, res) => {
  try {
    const { forumId } = req.params;
    const { content } = req.body;
    const authorId = req.session.user._id;

    const newPost = await postsData.createPost(forumId, authorId, content);
    return res.status(201).json(newPost);
  } catch (error) {
    console.error("Error creating post:", error);
    return res
      .status(400)
      .json({ error: error.message || "Failed to create post" });
  }
});

router.post("/posts/:postId/vote", ensureAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const { voteType } = req.body;
    const userId = req.session.user._id;

    const updatedPost = await postsData.votePost(postId, userId, voteType);
    return res.status(200).json(updatedPost);
  } catch (error) {
    console.error("Error voting on post:", error);
    return res
      .status(400)
      .json({ error: error.message || "Failed to vote on post" });
  }
});

export default router;
