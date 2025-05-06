import { ObjectId } from "mongodb";
import { reviews } from "../config/mongoCollections.js";
import { strCheck } from "../helpers.js";

export async function createReview(professorId, userId, rating, comment) {
  const reviewCol = await reviews();
  const newReview = {
    professorId: new ObjectId(professorId),
    userId: new ObjectId(userId),
    rating: Number(rating),
    comment: strCheck(comment, "comment"),
    createdAt: new Date(),
  };
  const insertResult = await reviewCol.insertOne(newReview);
  return { _id: insertResult.insertedId, ...newReview };
}

export async function getReviewsByProfessorId(professorId) {
  const reviewCol = await reviews();
  return await reviewCol
    .find({ professorId: new ObjectId(professorId) })
    .toArray();
}