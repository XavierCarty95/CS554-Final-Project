// src/components/Forum/ForumThread.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getPosts, createPost } from "../../services/forumServices";
import ForumPost from "./ForumPost";

export default function ForumThread({ forum, universityId }) {
  // Accept universityId prop
  const [posts, setPosts] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showReplyForm, setShowReplyForm] = useState(false);

  useEffect(() => {
    if (!forum._id) {
      console.error("Missing forum ID");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getPosts(forum._id, forum.universityId) // Pass universityId to getPosts
      .then((data) => {
        console.log("Posts loaded:", data);
        setPosts(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading posts:", err);
        setIsLoading(false);
      });
  }, [forum._id, forum.universityId]); // Add forum.universityId to dependencies

  const handleSubmitReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const newPost = await createPost({
        forumId: forum._id,
        content: newReply,
        universityId,
      });

      setPosts((prev) => [...prev, newPost]);
      setNewReply("");
      setShowReplyForm(false);
    } catch (err) {
      console.error("Error posting reply:", err);
      alert(err.response?.data?.error || "Failed to post reply");
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">
          <Link
            to={`/university/${universityId}/forums/${forum._id}`}
            className="text-blue-600 hover:underline"
          >
            {forum.title}
          </Link>
        </h3>
        <div className="text-sm text-gray-500">
          {new Date(forum.createdAt).toLocaleDateString()}
        </div>
      </div>

      {forum.tags && forum.tags.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {forum.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {isLoading ? (
        <p className="text-center text-gray-400">Loading posts...</p>
      ) : (
        <>
          <div className="space-y-4 mt-4">
            {posts.length === 0 ? (
              <p className="text-gray-500 italic">No replies yet.</p>
            ) : (
              posts.map((post) => (
                <ForumPost
                  key={post._id}
                  post={post}
                  universityId={universityId}
                />
              ))
            )}
          </div>

          <div className="mt-4">
            {!showReplyForm ? (
              <button
                onClick={() => setShowReplyForm(true)}
                className="text-blue-500 hover:underline"
              >
                Reply to this thread
              </button>
            ) : (
              <form onSubmit={handleSubmitReply}>
                <textarea
                  value={newReply}
                  onChange={(e) => setNewReply(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Write your reply..."
                  rows={3}
                  required
                />
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setShowReplyForm(false)}
                    className="px-3 py-1 text-gray-600 hover:bg-gray-100 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Post Reply
                  </button>
                </div>
              </form>
            )}
          </div>
        </>
      )}
    </div>
  );
}
