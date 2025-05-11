import { universities, professors, courses } from "./config/mongoCollections.js";
import { ObjectId } from "mongodb";

const newUniversities = [
  {
    name: "Pacific Tech University",
    location: "San Francisco, CA",
    overview: "Focused on innovation and software engineering.",
    requiredCourses: [
      {
        title: "Cloud Computing Fundamentals",
        semesterOffered: "Fall",
        yearRecommended: 2,
        major: "Computer Science"
      }
    ]
  },
  {
    name: "Northern Research College",
    location: "Seattle, WA",
    overview: "Renowned for data science and research excellence.",
    requiredCourses: [
      {
        title: "Data Science with Python",
        semesterOffered: "Fall",
        yearRecommended: 1,
        major: "Data Science"
      }
    ]
  }
];

const newProfessors = [
  {
    name: "Dr. Alice Winters",
    department: "Computer Science",
    universityName: "Pacific Tech University"
  },
  {
    name: "Dr. Omar Patel",
    department: "Data Science",
    universityName: "Northern Research College"
  }
];

const newCourses = [
  {
    title: "Cloud Computing Fundamentals",
    description: "Covers AWS, Azure, and GCP basics.",
    universityName: "Pacific Tech University",
    professorName: "Dr. Alice Winters",
    major: "Computer Science",
    semesterOffered: "Fall",
    yearRecommended: 2
  },
  {
    title: "Data Science with Python",
    description: "Explores Pandas, NumPy, and ML basics.",
    universityName: "Northern Research College",
    professorName: "Dr. Omar Patel",
    major: "Data Science",
    semesterOffered: "Fall",
    yearRecommended: 1
  }
];

const run = async () => {
  const universitiesCol = await universities();
  const professorsCol = await professors();
  const coursesCol = await courses();

  const uniMap = {}; // name -> _id

  for (const uni of newUniversities) {
    let existing = await universitiesCol.findOne({ name: uni.name });

    if (!existing) {
      const result = await universitiesCol.insertOne({
        name: uni.name,
        location: uni.location,
        overview: uni.overview,
        requiredCourses: uni.requiredCourses,
        publicChatId: new ObjectId().toString()
      });
      console.log(`✅ Added university: ${uni.name}`);
      uniMap[uni.name] = result.insertedId;
    } else {
      uniMap[uni.name] = existing._id;

      // Only update requiredCourses if not already set
      if (!existing.requiredCourses || existing.requiredCourses.length === 0) {
        await universitiesCol.updateOne(
          { _id: existing._id },
          { $set: { requiredCourses: uni.requiredCourses } }
        );
        console.log(`🔁 Updated requiredCourses for: ${uni.name}`);
      } else {
        console.log(`⚠️ University already has requiredCourses: ${uni.name}`);
      }
    }
  }

  const profMap = {}; // name -> _id

  for (const prof of newProfessors) {
    const uniId = uniMap[prof.universityName];
    if (!uniId) continue;

    const existing = await professorsCol.findOne({ name: prof.name, universityId: uniId });

    if (!existing) {
      const result = await professorsCol.insertOne({
        name: prof.name,
        department: prof.department,
        universityId: uniId
      });
      console.log(`✅ Added professor: ${prof.name}`);
      profMap[prof.name] = result.insertedId;
    } else {
      console.log(`⚠️ Professor already exists: ${prof.name}`);
      profMap[prof.name] = existing._id;
    }
  }

  for (const course of newCourses) {
    const uniId = uniMap[course.universityName];
    const profId = profMap[course.professorName];
    if (!uniId || !profId) continue;

    const exists = await coursesCol.findOne({
      title: course.title,
      universityId: uniId,
      professorId: profId,
      major: course.major
    });

    if (!exists) {
      await coursesCol.insertOne({
        title: course.title,
        description: course.description,
        universityId: uniId,
        professorId: profId,
        major: course.major,
        semesterOffered: course.semesterOffered,
        yearRecommended: course.yearRecommended,
        studentsEnrolled: []
      });
      console.log(`✅ Added course: ${course.title}`);
    } else {
      console.log(`⚠️ Course already exists: ${course.title}`);
    }
  }

  console.log("🎓 Course Scheduler Seed Complete!");
};

run();