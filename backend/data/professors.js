import {
  professors,
  reviews,
  universities,
  courses,
} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const getProfessorsByUniversity = async (universityId) => {
  if (!universityId || typeof universityId !== "string") {
    throw new Error("Valid university ID is required");
  }

  try {
    const professorsCollection = await professors();
    const uniId = ObjectId.isValid(universityId)
      ? new ObjectId(universityId)
      : universityId;

    const professorsList = await professorsCollection
      .find({ universityId: uniId })
      .toArray();

    return professorsList;
  } catch (error) {
    console.error("Error getting professors by university:", error);
    throw error;
  }
};

export const getProfessorById = async (professorId) => {
  if (!professorId || typeof professorId !== "string") {
    throw new Error("Valid professor ID is required");
  }

  try {
    const professorsCollection = await professors();
    const profId = ObjectId.isValid(professorId)
      ? new ObjectId(professorId)
      : professorId;

    const professor = await professorsCollection.findOne({ _id: profId });
    if (!professor) {
      throw new Error("Professor not found");
    }

    return professor;
  } catch (error) {
    console.error("Error getting professor by ID:", error);
    throw error;
  }
};

export const getProfessorWithCourses = async (professorId) => {
  if (!professorId || typeof professorId !== "string") {
    throw new Error("Valid professor ID is required");
  }

  try {
    const professor = await getProfessorById(professorId);

    const coursesCollection = await courses();
    const courseIds = professor.courses.map((id) =>
      ObjectId.isValid(id) ? new ObjectId(id) : id
    );

    const courseDetails = await coursesCollection
      .find({ _id: { $in: courseIds } })
      .toArray();

    return {
      ...professor,
      courseDetails,
    };
  } catch (error) {
    console.error("Error getting professor with courses:", error);
    throw error;
  }
};

export const getProfessorWithRatings = async (professorId) => {
  if (!professorId || typeof professorId !== "string") {
    throw new Error("Valid professor ID is required");
  }

  try {
    const professor = await getProfessorById(professorId);

    const reviewsCollection = await reviews();
    const professorReviews = await reviewsCollection
      .find({ professorId })
      .toArray();

    return {
      ...professor,
      ratings: professorReviews,
    };
  } catch (error) {
    console.error("Error getting professor with ratings:", error);
    throw error;
  }
};
