import express from "express";
import * as universitiesData from "../data/universities.js";
import { ObjectId } from "mongodb";
import {
  courses,
  universities,
  professors,
} from "../config/mongoCollections.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const universities = await universitiesData.getAllUniversities();
    return res.json(universities);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/getUniversityDropdown", async (req, res) => {
  try {
    const universities = await universitiesData.getUniversityDropdown();
    return res.json(universities);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
 
    const university = await universitiesData.getUniversityById(id);
    return res.json(university);
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

router.get("/search", async (req, res) => {
  try {
    const query = req.query.q || "";
    const universitiesCollection = await universities();

    const results = await universitiesCollection
      .find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { location: { $regex: query, $options: "i" } },
          { overview: { $regex: query, $options: "i" } },
        ],
      })
      .limit(20)
      .toArray();

    return res.json(results);
  } catch (e) {
    console.error("Search error:", e);
    return res.status(500).json({ error: "Failed to search universities" });
  }
});

router.get("/:universityId/courses", async (req, res) => {
  try {
    const { universityId } = req.params;

    if (!ObjectId.isValid(universityId)) {
      return res.status(400).json({ error: "Invalid university ID" });
    }

    const university = await universitiesData.getUniversityById(universityId);
    if (!university) {
      throw new Error("University not found and thus no courses");
    }

    const coursesCollection = await courses();
    const universityCourses = await coursesCollection
      .find({ universityId: universityId })
      .toArray();



    const professorsCollection = await professors();
    for (const course of universityCourses) {
      if (course.professorId) {
        const professor = await professorsCollection.findOne({
          _id: new ObjectId(course.professorId),
        });
        course.professorName = professor ? professor.name : "Unassigned";
        course.department = professor ? professor.department : "Unknown";
      } else {
        course.professorName = "Unassigned";
        course.department = "Unknown";
      }
    }

    return res.json(universityCourses);
  } catch (error) {
    console.error("Error fetching university courses:", error);
    return res.status(500).json({ error: "Failed to retrieve courses" });
  }
});

export default router;
