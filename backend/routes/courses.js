import express from "express";
import {
  getAllCourses,
  getCourseById,
  getCoursesByUniversity,
  getCoursesByProfessor,
  createCourse,
  deleteCourseById,
  searchCourses,
  getCoursesForUniversityDropdown 
} from "../data/courses.js";

const router = express.Router();

// GET /courses - list all courses
router.get("/", async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.json(courses);
  } catch (err) {
    console.error("Error fetching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /courses/search?q=term - text search on title/description
router.get("/search", async (req, res) => {
  const q = req.query.q || "";
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }
  try {
    const results = await searchCourses(q);
    res.json(results);
  } catch (err) {
    console.error("Error searching courses:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /courses/:id - get course by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const course = await getCourseById(id);
    res.json(course);
  } catch (err) {
    console.error(`Error fetching course ${id}:`, err);
    res.status(404).json({ error: "Course not found" });
  }
});

// GET /courses/university/:universityId - courses for a university
router.get("/university/:universityId", async (req, res) => {
  const { universityId } = req.params;
  try {
    const courses = await getCoursesByUniversity(universityId);
    res.json(courses);
  } catch (err) {
    console.error(
      `Error fetching courses for university ${universityId}:`,
      err
    );
    res.status(400).json({ error: "Invalid university ID" });
  }
});

// GET /courses/professor/:professorId - courses taught by a professor
router.get("/professor/:professorId", async (req, res) => {
  const { professorId } = req.params;
  try {
    const courses = await getCoursesByProfessor(professorId);
    res.json(courses);
  } catch (err) {
    console.error(`Error fetching courses for professor ${professorId}:`, err);
    res.status(400).json({ error: "Invalid professor ID" });
  }
});

// POST /courses - create a new course
router.post("/", async (req, res) => {
  const { title, description = "", universityId, professorId } = req.body;
  try {
    const newCourse = await createCourse({
      title,
      description,
      universityId,
      professorId,
    });
    res.status(201).json(newCourse);
  } catch (err) {
    console.error("Error creating course:", err);
    res.status(400).json({ error: err.message || "Failed to create course" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await deleteCourseById(id);
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    console.error(`Error deleting course ${id}:`, err);
    res.status(400).json({ error: err.message || "Failed to delete course" });
  }
});

router.get("/university/:universityId/dropdown", async (req, res) => {
  const { universityId } = req.params;
  try {
    const courses = await getCoursesForUniversityDropdown(universityId);
    res.json(courses);
  } catch (err) {
    console.error(`Error fetching dropdown courses for university ${universityId}:`, err);
    res.status(400).json({ error: err.message || "Failed to fetch courses" });
  }
});


export default router;
