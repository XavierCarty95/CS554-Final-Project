import React, { useState, useEffect } from "react";
import { getPosts, createPost } from "../../services/forumServices";

export default function ForumThread({ forum, currentUser }) {
  const [posts, setPosts] = useState([]);
  const [reply, setReply] = useState("");

  useEffect(() => {
    console.log("forum", forum._id);
    getPosts(forum._id).then(setPosts);
  }, [forum._id]);

  const handleReply = async (e) => {
    let userId = "userId1";
    // userId = currentUser._id;  Will be implemeneted later
    e.preventDefault();
    if (!reply) return;
    const newPost = await createPost({
      forumId: forum._id,
      authorId: userId,
      content: reply,
    });
    setPosts((prev) => [...prev, newPost]);
    setReply("");
  };

  return (
    <div className="forum-thread">
      <h3>{forum.title}</h3>
      <p>{forum.universityId}</p>
      <div>
        {posts.map((post) => (
          <div key={post._id} className="forum-post">
            <p>{post.content}</p>

            <small>{post.createdAt}</small>
          </div>
        ))}
        {console.log("posts", posts)}
      </div>
      <form onSubmit={handleReply}>
        <input
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          placeholder="Write a reply..."
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}
