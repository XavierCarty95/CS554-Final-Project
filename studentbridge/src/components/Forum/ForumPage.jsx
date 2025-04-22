// src/components/Forum/ForumPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getForums, createForum } from "../../services/forumServices";
import NewThreadForm from "./NewThreadForm";

export default function ForumPage() {
  const { universityId } = useParams();
  const [forums, setForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!universityId) {
      setError("University ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    console.log("University ID from params:", universityId);

    getForums(universityId)
      .then((data) => {
        console.log("Forums loaded:", data);
        setForums(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading forums:", err);
        setError(err.response?.data?.error || "Failed to load forums");
        setIsLoading(false);
      });
  }, [universityId]);

  const handleNewThread = async (title, tags) => {
    try {
      console.log("Creating new forum with title:", title, "and tags:", tags);
      const newForum = await createForum({
        title,
        universityId,
        tags,
      });
      setForums((prev) => [newForum, ...prev]);
    } catch (err) {
      console.error("Error creating forum:", err);
      alert(err.response?.data?.error || "Failed to create forum");
    }
  };

  if (isLoading)
    return <div className="text-center p-4">Loading forums...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-full px-4 py-4 m-10">
      <h2 className="text-2xl font-bold mb-6">University Forums</h2>
      <NewThreadForm onSubmit={handleNewThread} />
      <div className="mt-8 space-y-4">
        {forums.length === 0 ? (
          <p className="text-center text-gray-500">
            No forums yet. Be the first to create one!
          </p>
        ) : (
          forums.map((forum) => (
            <div
              key={forum._id}
              className="border rounded-lg p-4 bg-white shadow-sm"
            >
              <div className="flex justify-between items-start mb-2">
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
                <div className="flex flex-wrap gap-2">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
