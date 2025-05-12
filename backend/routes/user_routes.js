import express from "express";
import * as usersData from "../data/users.js";
import { forums, posts, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { strCheck, validateName } from "../helpers.js";

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

router.get("/:userId/forums", async (req, res) => {
  try {
    const { userId } = req.params;

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

    return res.json(userForums);
  } catch (error) {
    console.error("Error getting user forums:", error);
    return res.status(500).json({ error: "Failed to retrieve user forums" });
  }
});

router.get("/:userId/posts", async (req, res) => {
  try {
    const { userId } = req.params;

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

    const forumsCollection = await forums();
    for (const post of userPosts) {
      const forum = await forumsCollection.findOne({ _id: post.forumId });
      post.forumTitle = forum ? forum.title : "Unknown Forum";
    }

    return res.json(userPosts);
  } catch (error) {
    console.error("Error getting user posts:", error);
    return res.status(500).json({ error: "Failed to retrieve user posts" });
  }
});

router.put("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, major, year } = req.body;

    if (!req.session.user || req.session.user._id !== userId) {
      console.log("Unauthorized update attempt");
      return res
        .status(403)
        .json({ error: "Unauthorized to update this profile" });
    }

    try {
      strCheck(name, "Name");
      validateName(name);

      validateEmail(email);
    } catch (validationError) {
      return res.status(400).json({ error: validationError.message });
    }

    let userCollection = await users();
    const updateData = {
      name,
      email,
      profile: {
        major: major || "",
        year: year || "",
      },
    };

    let userIdObj;
    try {
      userIdObj = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
    
    } catch (e) {
      console.error("Invalid userId format:", e);
      userIdObj = userId;
    }

    const existingUser = await userCollection.findOne({ _id: userIdObj });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found in database" });
    }

    const updatedUser = await userCollection.findOneAndUpdate(
      { _id: userIdObj },
      { $set: updateData },
      { returnDocument: "after" }
    );

    return res.json({
      ...updatedUser,
      _id: updatedUser._id.toString(),
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ error: "Failed to update user profile: " + error.message });
  }
});

function validateEmail(email) {
  if (!email || typeof email !== "string") {
    throw new Error("Email must be a non-empty string");
  }
  email = email.trim();
  if (email.length === 0) {
    throw new Error("Email cannot be empty or just spaces");
  }
  const emailRegex = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  return email;
}

export default router;
