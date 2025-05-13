import { forums, users } from "../config/mongoCollections.js";
import { ObjectId } from "mongodb";
import { getRedisClient } from "../config/connectRedis.js";

export const getForumsByUniversity = async (universityId) => {
  if (!universityId || typeof universityId !== "string") {
    throw new Error("Invalid university ID");
  }

  try {
    const redisClient = getRedisClient();
    const cacheKey = `forums:university:${universityId}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Forums fetched from cache for university:", universityId);
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Redis error in getForumsByUniversity:", error);
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

  const userCollection = await users();
  for (const forum of forumList) {
    let createdByObj;
    try {
      createdByObj = ObjectId.isValid(forum.createdBy)
        ? new ObjectId(forum.createdBy)
        : forum.createdBy;
    } catch (e) {
      createdByObj = forum.createdBy;
    }

    const author = await userCollection.findOne({ _id: createdByObj });
    forum.authorName = author ? author.name : "Unknown User";
  }

  try {
    const redisClient = getRedisClient();
    const cacheKey = `forums:university:${universityId}`;
    await redisClient.setEx(cacheKey, 600, JSON.stringify(forumList));
    console.log("Forums cached for university:", universityId);
  } catch (error) {
    console.error("Redis caching error:", error);
  }

  return forumList;
};

export const getForumById = async (id) => {
  if (!id || typeof id !== "string") {
    throw new Error("Invalid forum ID");
  }

  try {
    const redisClient = getRedisClient();
    const cacheKey = `forum:${id}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Forum fetched from cache:", id);
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Redis error in getForumById:", error);
  }

  const forumsCollection = await forums();
  let forumIdObj;
  try {
    forumIdObj = ObjectId.isValid(id) ? new ObjectId(id) : id;
  } catch (e) {
    throw new Error("Invalid forum ID format");
  }

  const forum = await forumsCollection.findOne({ _id: forumIdObj });
  if (!forum) {
    throw new Error("Forum not found");
  }

  try {
    const redisClient = getRedisClient();
    const cacheKey = `forum:${id}`;
    await redisClient.setEx(cacheKey, 600, JSON.stringify(forum));
    console.log("Forum cached:", id);
  } catch (error) {
    console.error("Redis caching error:", error);
  }

  return forum;
};

export const createForum = async (universityId, title, tags, createdBy) => {
  if (!title || typeof title !== "string" || title.trim() === "") {
    throw new Error("Invalid forum title");
  }

  title = title.trim();

  if (title.length < 5) {
    throw new Error("Title must be at least 5 characters long");
  }

  if (title.length > 150) {
    throw new Error("Title must be at most 150 characters long");
  }

  if (!/[a-zA-Z]/.test(title)) {
    throw new Error("Title must contain at least one letter");
  }

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

  try {
    const redisClient = getRedisClient();
    await redisClient.del(`forums:university:${universityId}`);
    console.log("University forums cache invalidated for:", universityId);
  } catch (error) {
    console.error("Redis cache invalidation error:", error);
  }

  return {
    _id: result.insertedId.toString(),
    ...newForum,
  };
};
