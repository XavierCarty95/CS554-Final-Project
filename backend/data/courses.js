import { dbConnection } from "../config/mongoConnection.js";
import { ObjectId } from "mongodb";

const getCoursesCollection = async () => {
  const db = await dbConnection();
  return db.collection("courses");
};

export const getAllCourses = async () => {
  const coll = await getCoursesCollection();
  return await coll.find({}).toArray();
};

export const getCourseById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid course ID");
  }

  const coll = await getCoursesCollection();
  let objId;
  try {
    objId = ObjectId.isValid(id) ? new ObjectId(id) : id;
  } catch (e) {
    throw new Error("Invalid course ID format");
  }

  const course = await coll.findOne({ _id: objId });
  if (!course) throw new Error("Course not found");
  return course;
};

export const getCoursesByUniversity = async (universityId) => {
  if (!universityId || typeof universityId !== "string") {
    throw new Error("Invalid university ID");
  }

  const coll = await getCoursesCollection();
  const uniId = ObjectId.isValid(universityId)
    ? new ObjectId(universityId)
    : universityId;

  return await coll.find({ universityId: universityId }).toArray();
};

export const getCoursesByProfessor = async (professorId) => {
  if (!professorId || typeof professorId !== "string") {
    throw new Error("Invalid professor ID");
  }

  const coll = await getCoursesCollection();
  const profId = ObjectId.isValid(professorId)
    ? new ObjectId(professorId)
    : professorId;

  return await coll.find({ professorId: professorId }).toArray();
};

export const createCourse = async ({
  title,
  description,
  universityId,
  professorId,
}) => {
  if (!title || typeof title !== "string")
    throw new Error("Title is required and must be a string");
  if (!universityId || typeof universityId !== "string")
    throw new Error("University ID is required");
  if (!professorId || typeof professorId !== "string")
    throw new Error("Professor ID is required");

  const coll = await getCoursesCollection();
  const newCourse = {
    title: title.trim(),
    description: description ? description.trim() : "",
    universityId: ObjectId.isValid(universityId)
      ? new ObjectId(universityId)
      : universityId,
    professorId: ObjectId.isValid(professorId)
      ? new ObjectId(professorId)
      : professorId,
    studentsEnrolled: [],
  };

  const result = await coll.insertOne(newCourse);
  return getCourseById(result.insertedId.toString());
};

export const deleteCourseById = async (id) => {
  if (!id || typeof id !== "string") throw new Error("Invalid course ID");

  const coll = await getCoursesCollection();
  const objectId = ObjectId.isValid(id) ? new ObjectId(id) : id;

  const result = await coll.deleteOne({ _id: objectId });
  if (result.deletedCount === 0) {
    throw new Error("Course not found or already deleted");
  }

  return true;
};

export const searchCourses = async (query) => {
  if (!query || typeof query !== "string")
    throw new Error("Search query must be a non-empty string");

  const coll = await getCoursesCollection();

  return await coll
    .find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    })
    .toArray();
};

export const getCoursesForUniversityDropdown = async (universityId) => {
  if (!universityId || typeof universityId !== "string") {
    throw new Error("Invalid university ID");
  }

  const coll = await getCoursesCollection();
  const uniId = ObjectId.isValid(universityId)
    ? new ObjectId(universityId)
    : universityId;

  const courses = await coll
    .find({ universityId: uniId })
    .project({ _id: 1, title: 1 })
    .toArray();

  return courses;
};
