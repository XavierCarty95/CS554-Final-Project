import express from "express";
import {
  professors,
  reviews,
  universities,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

const router = express.Router({ mergeParams: true });

router.get("/", async (req, res) => {
  try {
    if (req.params.universityId) {
      const { universityId } = req.params;

      if (!ObjectId.isValid(universityId)) {
        return res.status(400).json({ error: "Invalid university ID" });
      }

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
            ratings: profReviews.map((r) => ({
              score: r.rating,
              comment: r.comment,
            })),
          };
        })
      );

      return res.json(profsWithRatings);
    }

    const professorsCollection = await professors();
    const allProfessors = await professorsCollection.find({}).toArray();
    res.json(allProfessors);
  } catch (e) {
    console.error("Error fetching professors:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:professorId", async (req, res) => {
  try {
    const { professorId } = req.params;
    if (!ObjectId.isValid(professorId)) {
      return res.status(400).json({ error: "Invalid professor ID" });
    }

    const professorsCollection = await professors();
    const professor = await professorsCollection.findOne({
      _id: new ObjectId(professorId),
    });

    if (!professor) {
      return res.status(404).json({ error: "Professor not found" });
    }

    res.json(professor);
  } catch (e) {
    console.error("Error fetching professor by ID:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/byUniversity/:universityId", async (req, res) => {
  const { universityId } = req.params;

  if (!ObjectId.isValid(universityId)) {
    return res.status(400).json({ error: "Invalid university ID" });
  }

  try {
    const professorsCollection = await professors();
    const reviewsCollection = await reviews();

    const profs = await professorsCollection
      .find({ universityId: universityId })
      .toArray();



    const profsWithRatings = await Promise.all(
      profs.map(async (prof) => {
        const profReviews = await reviewsCollection
          .find({ professorId: prof._id.toString() })
          .toArray();

        return {
          ...prof,
          ratings: profReviews.map((r) => ({
            score: r.rating,
            comment: r.comment,
          })),
        };
      })
    );

    res.json(profsWithRatings);
  } catch (e) {
    console.error("Error fetching professors by university:", e);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const professorsCollection = await professors();

    const results = await professorsCollection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { department: { $regex: query, $options: "i" } },
        ],
      })
      .limit(20)
      .toArray();

    return res.json(results);
  } catch (e) {
    console.error("Search error:", e);
    return res.status(500).json({ error: "Failed to search professors" });
  }
});

export default router;
