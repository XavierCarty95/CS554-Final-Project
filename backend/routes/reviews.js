import express from "express";
import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { createReview, getReviewsByProfessorId } from "../data/reviews.js";

const router = express.Router();

// POST review (limit 2 per user per professor)
router.post("/", async (req, res) => {
  try {
    const { professorId, userId, rating, comment } = req.body;

    const existing = await getReviewsByProfessorId(professorId);
    const userReviews = existing.filter(r => r.userId.toString() === userId);
    if (userReviews.length >= 2) {
      return res.status(400).json({ error: "You can only post up to 2 reviews." });
    }

    const review = await createReview(professorId, userId, rating, comment);
    res.status(201).json(review);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// GET reviews by professor
router.get("/:professorId", async (req, res) => {
  try {
    const data = await getReviewsByProfessorId(req.params.professorId);
    res.json(data);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch reviews" });
  }
});

// PUT update review
router.put("/:reviewId", async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const reviewCol = await reviews();
    await reviewCol.updateOne({ _id: new ObjectId(req.params.reviewId) }, { $set: { rating, comment } });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE review
router.delete("/:reviewId", async (req, res) => {
  try {
    const reviewCol = await reviews();
    await reviewCol.deleteOne({ _id: new ObjectId(req.params.reviewId) });
    res.sendStatus(200);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;