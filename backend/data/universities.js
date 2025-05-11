
import { dbConnection } from "../config/mongoConnection.js";
import { ObjectId } from "mongodb";

const getUniversitiesCollection = async () => {
  const db = await dbConnection();
  return db.collection("universities");
};

export const getAllUniversities = async () => {
  const universitiesCollection = await getUniversitiesCollection();

  return await universitiesCollection.find({}).toArray();
};

export const getUniversityById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid university ID");
  }

  const universitiesCollection = await getUniversitiesCollection();

  let universityIdObj;
  try {
    universityIdObj = ObjectId.isValid(id) ? new ObjectId(id) : id;
  } catch (e) {
    throw new Error("Invalid university ID format");
  }

  const university = await universitiesCollection.findOne({
    _id: universityIdObj,
  });

  if (!university) {
    throw new Error("University not found");
  }

  return university;
};

export const getUniversityDropdown = async () => {
  const universitiesCollection = await getUniversitiesCollection();
  const universities = await universitiesCollection
    .find({}, { projection: { _id: 1, name: 1 } })
    .toArray();
  return universities;
};


export const getRequiredCoursesForMajor = async (universityId, major) => {
  const universitiesCollection = await getUniversitiesCollection();
  const university = await universitiesCollection.findOne({ _id: new ObjectId(universityId) });

  if (!university || !university.requiredCourses) {
    throw new Error("Required courses not found");
  }

  return university.requiredCourses.filter(
    (course) => course.major === major
  );
};