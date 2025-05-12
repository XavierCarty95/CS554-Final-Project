import express from 'express';
import { getRequiredCoursesForMajor } from '../data/universities.js';
import { ObjectId } from 'mongodb';
import { universities } from '../config/mongoCollections.js';

const router = express.Router();

router.get('/recommendations/:universityId/:major/:semester', async (req, res) => {
  const { universityId, major, semester } = req.params;

  const semesterNum = parseInt(semester);
  if (isNaN(semesterNum)) {
    return res.status(400).json({ error: "Invalid semester number" });
  }

  try {
    const allCourses = await getRequiredCoursesForMajor(universityId, major);
    const recommended = allCourses.filter(
      (course) =>
        course.yearRecommended === semesterNum &&
        course.semesterOffered === (semesterNum % 2 === 1 ? 'Fall' : 'Spring')
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
    if (!Array.isArray(university.requiredCourses)) {
      return res.status(404).json({ error: "Course data is invalid" });
    }

    const majorCourses = university.requiredCourses.filter((c) => {
      const isMatch = c.major?.toLowerCase() === major.toLowerCase();
      if (isMatch) {
        console.log(`✔ ${c.title} - Year ${c.yearRecommended}, ${c.semesterOffered}`);
      }
      return isMatch;
    });

    const plan = {
      year1: { Fall: [], Spring: [] },
      year2: { Fall: [], Spring: [] },
      year3: { Fall: [], Spring: [] },
      year4: { Fall: [], Spring: [] },
    };

    for (const course of majorCourses) {
      const year = Number(course.yearRecommended);
      const sem = course.semesterOffered?.charAt(0).toUpperCase() + course.semesterOffered?.slice(1).toLowerCase();
      const yearKey = `year${year}`;
      if (plan[yearKey] && ['Fall', 'Spring'].includes(sem)) {
        plan[yearKey][sem].push(course);
      }
    }

    res.json(plan);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


export default router;