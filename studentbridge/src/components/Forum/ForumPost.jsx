// src/components/Forum/ForumPost.jsx
import React, { useState } from "react";
import { votePost } from "../../services/forumServices";

export default function ForumPost({ post, universityId }) {
  const [votes, setVotes] = useState(post.votes || []);

  const handleVote = async (voteType) => {
    try {
      const updatedPost = await votePost(post._id, voteType, universityId);
      setVotes(updatedPost.votes);
    } catch (err) {
      console.error("Error voting:", err);
      alert("You can only vote once per post.");
    }
  };

  const getVoteCount = () => {
    return votes.reduce((count, vote) => {
      if (vote.type === "upvote") return count + 1;
      if (vote.type === "downvote") return count - 1;
      return count;
    }, 0);
  };

  return (
    <div className="border-l-4 border-gray-200 pl-4 py-2">
      <div className="text-gray-700">{post.content}</div>
      <div className="flex items-center mt-2 text-sm text-gray-500">
        <div className="flex items-center mr-4">
          <button
            onClick={() => handleVote("upvote")}
            className="text-gray-400 hover:text-green-500 mr-1"
          >
            ▲
          </button>
          <span>{getVoteCount()}</span>
          <button
            onClick={() => handleVote("downvote")}
            className="text-gray-400 hover:text-red-500 ml-1"
          >
            ▼
          </button>
        </div>
        <div>Posted on {new Date(post.createdAt).toLocaleDateString()}</div>
      </div>
    </div>
  );
}
