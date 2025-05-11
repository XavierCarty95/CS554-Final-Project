import express from 'express';
import { getRequiredCoursesForMajor } from '../data/universities.js';
import { ObjectId } from 'mongodb';
import { universities } from '../config/mongoCollections.js';

const router = express.Router();

router.get('/recommendations/:universityId/:major/:semester', async (req, res) => {
  const { universityId, major, semester } = req.params;

  try {
    const allCourses = await getRequiredCoursesForMajor(universityId, major);
    const recommended = allCourses.filter(
      (course) =>
        course.yearRecommended === parseInt(semester) &&
        course.semesterOffered === 'Fall' // or dynamic based on time
    );
    res.json(recommended);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});



router.get('/full-plan/:universityId/:major', async (req, res) => {
  const { universityId, major } = req.params;

  if (!ObjectId.isValid(universityId)) {
    return res.status(400).json({ error: "Invalid university ID" });
  }

  try {
    const universitiesCol = await universities();
    const university = await universitiesCol.findOne({ _id: new ObjectId(universityId) });

    if (!university) return res.status(404).json({ error: "University not found" });
    if (!university.requiredCourses) return res.status(404).json({ error: "No required courses found" });

    const majorCourses = university.requiredCourses.filter(c => c.major === major);

    const plan = {
      year1: { Fall: [], Spring: [] },
      year2: { Fall: [], Spring: [] },
      year3: { Fall: [], Spring: [] },
      year4: { Fall: [], Spring: [] },
    };

    for (const course of majorCourses) {
      const yearKey = `year${course.yearRecommended}`;
      if (plan[yearKey] && plan[yearKey][course.semesterOffered]) {
        plan[yearKey][course.semesterOffered].push(course);
      }
    }

    res.json(plan);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


export default router;