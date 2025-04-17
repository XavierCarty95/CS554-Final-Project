let mockForums = [
  {
    _id: "forumId1",
    title: "Best courses for CS majors?",
    universityId: "uni123",
    tags: ["CS", "advice"],
    createdBy: "userId1",
    createdAt: "2025-04-17T10:00:00Z",
  },
];

let mockPosts = [
  {
    _id: "postId1",
    forumId: "forumId1",
    authorId: "userId2",
    content: "I recommend ...",
    createdAt: "2025-04-17T11:00:00Z",
    votes: [{ userId: "userId3", type: "upvote" }],
  },
];

export async function getForums(universityId) {
  return mockForums.filter((f) => f.universityId === universityId);
}

export async function getPosts(forumId) {
  return mockPosts.filter((p) => p.forumId === forumId);
}

export async function createForum({ title, universityId, tags, createdBy }) {
  const newForum = {
    _id: "forumId" + Date.now(),
    title,
    universityId,
    tags,
    createdBy,
    createdAt: new Date().toISOString(),
  };
  mockForums.unshift(newForum);
  return newForum;
}

export async function createPost({ forumId, authorId, content }) {

  const newPost = {
    _id: "postId" + Date.now(),
    forumId,
    authorId,
    content,
    createdAt: new Date().toISOString(),
    votes: [],
  };
  mockPosts.push(newPost);
  return newPost;
}
