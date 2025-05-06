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

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const university = await universitiesData.getUniversityById(id);
    return res.json(university);
  } catch (e) {
    return res.status(404).json({ error: e.message });
  }
});

// Add this below the other routes
router.get("/search", async (req, res) => {
  try {
    const query = req.query.q?.toLowerCase() || "";

    // Optional: if your data file has a custom search function
    // const results = await universitiesData.searchUniversities(query);

    // Otherwise, do a direct match from your MongoDB collection
    const db = await import("../config/mongoConnection.js").then(mod => mod.getDb());
    const universities = await db.collection("universities")
      .find({ name: { $regex: query, $options: "i" } })
      .project({ _id: 1, name: 1 })
      .toArray();

    return res.json(universities.map(u => ({
      id: u._id.toString(),
      name: u.name,
      type: "university"
    })));
  } catch (e) {
    console.error("Search error:", e);
    return res.status(500).json({ error: "Failed to search universities" });
  }
});

export default router;
