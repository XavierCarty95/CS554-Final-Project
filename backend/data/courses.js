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
  return await coll
    .find({
      universityId: ObjectId.isValid(universityId)
        ? new ObjectId(universityId)
        : universityId,
    })
    .toArray();
};

export const getCoursesByProfessor = async (professorId) => {
  if (!professorId || typeof professorId !== "string") {
    throw new Error("Invalid professor ID");
  }
  const coll = await getCoursesCollection();
  return await coll
    .find({
      professorId: ObjectId.isValid(professorId)
        ? new ObjectId(professorId)
        : professorId,
    })
    .toArray();
};

export const createCourse = async ({
  title,
  description,
  universityId,
  professorId,
}) => {
  if (!title || typeof title !== "string")
    throw new Error("Title is required and must be a string");
  if (!description || typeof description !== "string")
    throw new Error("Description is required and must be a string");
  if (!universityId || typeof universityId !== "string")
    throw new Error("University ID is required");
  if (!professorId || typeof professorId !== "string")
    throw new Error("Professor ID is required");

  const coll = await getCoursesCollection();
  const newCourse = {
    title: title.trim(),
    description: description.trim(),
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

export const searchCourses = async (query) => {
  if (!query || typeof query !== "string")
    throw new Error("Search query must be a non-empty string");
  const coll = await getCoursesCollection();
  return await coll
    .find(
      { $text: { $search: query } },
      { projection: { score: { $meta: "textScore" } } }
    )
    .sort({ score: { $meta: "textScore" } })
    .toArray();
};
