// data/universities.js
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
