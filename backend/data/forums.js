import {forums} from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";

export const getForumsByUniversity = async (universityId) => {


  if (!universityId || typeof universityId !== "string") {
    throw new Error("Invalid university ID");
  }


  const forumsCollection = await forums();

  let uniIdQuery;
  try {
    uniIdQuery = ObjectId.isValid(universityId)
      ? new ObjectId(universityId)
      : universityId;
  } catch (e) {
    uniIdQuery = universityId;
  }

  const forumList = await forumsCollection
    .find({ universityId: uniIdQuery })
    .sort({ createdAt: -1 })
    .toArray();

  return forumList;
};

export const createForum = async (universityId, title, tags, createdBy) => {
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new Error("Invalid forum title");
  }

  title = title.trim();

  if (!universityId || typeof universityId !== "string") {
    throw new Error("Invalid university ID");
  }

  if (!createdBy || typeof createdBy !== "string") {
    throw new Error("Invalid creator ID");
  }

  let uniIdObj, createdByObj;
  try {
    uniIdObj = ObjectId.isValid(universityId)
      ? new ObjectId(universityId)
      : universityId;
    createdByObj = ObjectId.isValid(createdBy)
      ? new ObjectId(createdBy)
      : createdBy;
  } catch (e) {
    throw new Error("Invalid ID format");
  }

  const newForum = {
    universityId: uniIdObj,
    title,
    tags: Array.isArray(tags) ? tags : [],
    createdBy: createdByObj,
    createdAt: new Date(),
  };

  const forumsCollection = await forums();
  const result = await forumsCollection.insertOne(newForum);

  if (!result.acknowledged) {
    throw new Error("Could not create forum");
  }

  return {
    _id: result.insertedId.toString(),
    ...newForum,
  };
};
