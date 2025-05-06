// routes/professors.js
import express from 'express';
import { professors, reviews } from '../config/mongoCollections.js';
import { ObjectId } from 'mongodb';

const router = express.Router();

router.get('/byUniversity/:universityId', async (req, res) => {
  const { universityId } = req.params;

  if (!ObjectId.isValid(universityId)) {
    return res.status(400).json({ error: 'Invalid university ID' });
  }

  try {
    const professorsCollection = await professors();
    const reviewsCollection = await reviews();

    const profs = await professorsCollection
      .find({ universityId: new ObjectId(universityId) })
      .toArray();

    const profsWithRatings = await Promise.all(
      profs.map(async (prof) => {
        const profReviews = await reviewsCollection
          .find({ professorId: prof._id.toString() })
          .toArray();
        return {
          ...prof,
          ratings: profReviews.map((r) => ({ score: r.rating, comment: r.comment }))
        };
      })
    );

    res.json(profsWithRatings);
  } catch (e) {
    console.error("Error fetching professors by university:", e);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;