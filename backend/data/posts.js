import { ObjectId } from "mongodb";
import { posts, forums } from "../config/mongoCollections.js";

export const getPostsByForum = async (forumId) => {
  if (!forumId || typeof forumId !== "string") {
    throw new Error("Invalid forum ID");
  }

  forumId = forumId.trim();

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

  return await postsCollection.findOne({ _id: postIdObj });
};
