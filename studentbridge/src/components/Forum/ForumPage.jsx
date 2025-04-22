// src/components/Forum/ForumPage.jsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getForums, createForum } from "../../services/forumServices";
import ForumThread from "./ForumThread";
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
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">University Forums</h2>
      <NewThreadForm onSubmit={handleNewThread} />
      <div className="mt-8 space-y-6">
        {forums.length === 0 ? (
          <p className="text-center text-gray-500">
            No forums yet. Be the first to create one!
          </p>
        ) : (
          forums.map((forum) => (
            <ForumThread
              key={forum._id}
              forum={forum}
              universityId={universityId}
            />
          ))
        )}
      </div>
    </div>
  );
}
