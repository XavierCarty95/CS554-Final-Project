import { ObjectId } from "mongodb";
import { posts, forums, users } from "../config/mongoCollections.js";
import { getRedisClient } from "../config/connectRedis.js";

export const getPostsByForum = async (forumId) => {
  if (!forumId || typeof forumId !== "string") {
    throw new Error("Invalid forum ID");
  }

  forumId = forumId.trim();

  try {
    const redisClient = getRedisClient();
    const cacheKey = `posts:forum:${forumId}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Posts fetched from cache for forum:", forumId);
      return JSON.parse(cachedData);
    }
  } catch (error) {
    console.error("Redis error in getPostsByForum:", error);
  }

  let forumIdObj;
  try {
    forumIdObj = ObjectId.isValid(forumId) ? new ObjectId(forumId) : forumId;
  } catch (e) {
    throw new Error("Invalid forum ID format");
  }

  const postsCollection = await posts();
  const postList = await postsCollection
    .find({ forumId: forumIdObj })
    .sort({ createdAt: -1 })
    .toArray();

  const userCollection = await users();
  for (const post of postList) {
    const author = await userCollection.findOne({ _id: post.authorId });
    post.authorName = author ? author.name : "Unknown User";
  }

  try {
    const redisClient = getRedisClient();
    const cacheKey = `posts:forum:${forumId}`;
    await redisClient.setEx(cacheKey, 300, JSON.stringify(postList));
    console.log("Posts cached for forum:", forumId);
  } catch (error) {
    console.error("Redis caching error:", error);
  }

  return postList;
};

export const createPost = async (forumId, authorId, content) => {
  if (!forumId || typeof forumId !== "string") {
    throw new Error("Invalid forum ID");
  }

  if (!authorId || typeof authorId !== "string") {
    throw new Error("Invalid author ID");
  }

  if (!content || typeof content !== "string" || content.trim() === "") {
    throw new Error("Content cannot be empty");
  }

  content = content.trim();

  if (content.length < 10) {
    throw new Error("Content must be at least 10 characters long");
  }

  if (!/[a-zA-Z0-9]/.test(content)) {
    throw new Error("Content must contain at least one letter or number");
  }

  forumId = forumId.trim();
  authorId = authorId.trim();
  content = content.trim();

  let forumIdObj, authorIdObj;
  try {
    forumIdObj = ObjectId.isValid(forumId) ? new ObjectId(forumId) : forumId;
    authorIdObj = ObjectId.isValid(authorId)
      ? new ObjectId(authorId)
      : authorId;
  } catch (e) {
    throw new Error("Invalid ID format");
  }

  const forumsCollection = await forums();
  const forum = await forumsCollection.findOne({
    _id: forumIdObj,
  });

  if (!forum) {
    throw new Error("Forum not found");
  }

  const newPost = {
    forumId: forumIdObj,
    authorId: authorIdObj,
    content,
    createdAt: new Date(),
    votes: [],
  };

  const postsCollection = await posts();
  const result = await postsCollection.insertOne(newPost);

  if (!result.acknowledged) {
    throw new Error("Could not create post");
  }

  try {
    const redisClient = getRedisClient();
    await redisClient.del(`posts:forum:${forumId}`);
    console.log("Forum posts cache invalidated for:", forumId);
  } catch (error) {
    console.error("Redis cache invalidation error:", error);
  }

  return { ...newPost, _id: result.insertedId.toString() };
};

export const votePost = async (postId, userId, voteType) => {
  if (!postId || typeof postId !== "string") {
    throw new Error("Invalid post ID");
  }

  if (!userId || typeof userId !== "string") {
    throw new Error("Invalid user ID");
  }

  if (!["upvote", "downvote"].includes(voteType)) {
    throw new Error("Vote type must be 'upvote' or 'downvote'");
  }

  const postsCollection = await posts();

  let postIdObj;
  try {
    postIdObj = ObjectId.isValid(postId) ? new ObjectId(postId) : postId;
  } catch (e) {
    throw new Error("Invalid post ID format");
  }

  const post = await postsCollection.findOne({ _id: postIdObj });
  if (!post) {
    throw new Error("Post not found");
  }

  const updatedVotes = post.votes.filter((vote) => vote.userId !== userId);
  updatedVotes.push({ userId, type: voteType });

  await postsCollection.updateOne(
    { _id: postIdObj },
    { $set: { votes: updatedVotes } }
  );

  try {
    const redisClient = getRedisClient();
    await redisClient.del(`posts:forum:${post.forumId}`);
  } catch (error) {
    console.error("Redis cache invalidation error:", error);
  }

  return await postsCollection.findOne({ _id: postIdObj });
};
