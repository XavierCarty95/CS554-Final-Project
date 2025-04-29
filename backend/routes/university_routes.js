// routes/university_routes.js
import express from "express";
import * as universitiesData from "../data/universities.js";

const router = express.Router();


router.get("/", async (req, res) => {
  try {
    const universities = await universitiesData.getAllUniversities();
    return res.json(universities);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

//get university dropdown
router.get("/getUniversityDropdown", async (req, res) => {
  try {
    const universities = await universitiesData.getUniversityDropdown();
    return res.json(universities);
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
});

// Get university by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const university = await universitiesData.getUniversityById(id);
    return res.json(university);
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

export default router;
