import { ObjectId } from "mongodb";
import { reviews, users } from "../config/mongoCollections.js";
import { strCheck } from "../helpers.js";

export async function createReview(professorId, userId, rating, comment) {
  const reviewCol = await reviews();
  const existing = await reviewCol.find({
    professorId: new ObjectId(professorId),
    userId: new ObjectId(userId)
  }).toArray();

  if (existing.length >= 2) {
    throw new Error("You can only post up to 2 reviews.");
  }

  const userCol = await users();
  const user = await userCol.findOne({ _id: new ObjectId(userId) });
  const userName = user?.name || "Unknown";

  const newReview = {
    professorId: new ObjectId(professorId),
    userId: new ObjectId(userId),
    userName,
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

export async function updateReview(reviewId, rating, comment) {
  const reviewCol = await reviews();
  await reviewCol.updateOne(
    { _id: new ObjectId(reviewId) },
    { $set: { rating: Number(rating), comment: strCheck(comment, "comment") } }
  );
  return true;
}

export async function deleteReview(reviewId) {
  const reviewCol = await reviews();
  await reviewCol.deleteOne({ _id: new ObjectId(reviewId) });
  return true;
}