import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getForumById,
  getPosts,
  createPost,
} from "../../services/forumServices";
import ForumPost from "./ForumPost";

export default function ThreadDetailPage() {
  const { universityId, forumId } = useParams();
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [newReply, setNewReply] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!forumId || !universityId) {
      setError("Forum ID and University ID are required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    getForumById(forumId, universityId)
      .then((forumData) => {
        setForum(forumData);

        return getPosts(forumId);
      })
      .then((postsData) => {
        setPosts(postsData);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading thread details:", err);
        setError(err.response?.data?.error || "Failed to load thread details");
        setIsLoading(false);
      });
  }, [forumId, universityId]);

  const handleNewReply = async (e) => {
    e.preventDefault();
    if (!newReply.trim()) return;

    try {
      const newPost = await createPost({
        forumId,
        content: newReply,
        universityId,
      });

      setPosts((prev) => [...prev, newPost]);
      setNewReply("");
    } catch (err) {
      console.error("Error posting reply:", err);
      alert(err.response?.data?.error || "Failed to post reply");
    }
  };

  if (isLoading)
    return <div className="text-center p-4">Loading thread...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!forum) return <div className="text-center p-4">Thread not found</div>;

  return (
    <div className="w-full px-4 py-4">
      <div className="mb-4">
        <Link
          to={`/university/${universityId}/forums`}
          className="text-blue-600 hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Forums
        </Link>
      </div>

      {/* Thread title and metadata */}
      <div className="border-b pb-4 mb-6">
        <h2 className="text-2xl font-bold">{forum.title}</h2>
        <div className="flex flex-wrap gap-2 mt-2">
          {forum.tags &&
            forum.tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
        </div>
        <div className="text-sm text-gray-500 mt-2">
          Started on {new Date(forum.createdAt).toLocaleDateString()}
        </div>
      </div>

      {/* Posts/replies */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-center text-gray-500 italic">
            No replies yet. Be the first to reply!
          </p>
        ) : (
          posts.map((post) => (
            <ForumPost key={post._id} post={post} universityId={universityId} />
          ))
        )}
      </div>

      {/* Reply form */}
      <div className="mt-6">
        <form onSubmit={handleNewReply}>
          <textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="Write your reply..."
            rows={3}
            required
          />
          <div className="flex justify-end mt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Post Reply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
