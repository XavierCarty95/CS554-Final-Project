import express from "express";
import * as usersData from "../data/users.js";

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

export default router;