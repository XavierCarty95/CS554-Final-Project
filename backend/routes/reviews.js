import express from "express";
import { ObjectId } from "mongodb";
import { reviews, users } from "../config/mongoCollections.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { professorId, userId, rating, comment } = req.body;

    if (!professorId || !userId || !rating || !comment) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const reviewsCollection = await reviews();

    // Check if user has already submitted 2 reviews for this professor
    const existing = await reviewsCollection
      .find({
        professorId: professorId,
        userId: userId,
      })
      .toArray();

    if (existing.length >= 2) {
      return res
        .status(400)
        .json({ error: "You can only post up to 2 reviews." });
    }

    const usersCollection = await users();
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    const userName = user?.name || "Unknown";

    const newReview = {
      professorId: professorId,
      userId: userId,
      userName: userName,
      rating: Number(rating),
      comment: comment.trim(),
      createdAt: new Date(),
    };

    const result = await reviewsCollection.insertOne(newReview);

    res.status(201).json({
      _id: result.insertedId.toString(),
      ...newReview,
    });
  } catch (e) {
    console.error("Error creating review:", e);
    res.status(400).json({ error: e.message });
  }
});

// GET reviews by professor
router.get("/:professorId", async (req, res) => {
  try {
    const { professorId } = req.params;
    const reviewsCollection = await reviews();

    const professorReviews = await reviewsCollection
      .find({ professorId: professorId })
      .sort({ createdAt: -1 })
      .toArray();

    res.json(professorReviews);
  } catch (e) {
    console.error("Error fetching reviews:", e);
    res.status(500).json({ error: "Could not fetch reviews" });
  }
});

router.put("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const reviewsCollection = await reviews();
    const result = await reviewsCollection.updateOne(
      { _id: new ObjectId(reviewId) },
      {
        $set: {
          rating: Number(rating),
          comment: comment.trim(),
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("Error updating review:", e);
    res.status(400).json({ error: e.message });
  }
});

router.delete("/:reviewId", async (req, res) => {
  try {
    const { reviewId } = req.params;

    if (!ObjectId.isValid(reviewId)) {
      return res.status(400).json({ error: "Invalid review ID" });
    }

    const reviewsCollection = await reviews();
    const result = await reviewsCollection.deleteOne({
      _id: new ObjectId(reviewId),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Review not found" });
    }

    res.sendStatus(200);
  } catch (e) {
    console.error("Error deleting review:", e);
    res.status(400).json({ error: e.message });
  }
});

export default router;
