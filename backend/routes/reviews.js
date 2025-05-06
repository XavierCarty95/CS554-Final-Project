// routes/reviews.js
import express from "express";
import { createReview, getReviewsByProfessorId } from "../data/reviews.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { professorId, userId, rating, comment } = req.body;
    const review = await createReview(professorId, userId, rating, comment);
    res.status(201).json(review);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

router.get("/:professorId", async (req, res) => {
  try {
    const reviews = await getReviewsByProfessorId(req.params.professorId);
    res.json(reviews);
  } catch (e) {
    res.status(500).json({ error: "Could not fetch reviews" });
  }
});

export default router;