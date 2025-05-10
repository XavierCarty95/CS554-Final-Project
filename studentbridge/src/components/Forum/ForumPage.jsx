import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getForums, createForum } from "../../services/forumServices";
import NewThreadForm from "./NewThreadForm";

export default function ForumPage() {
  const { universityId } = useParams();
  const [forums, setForums] = useState([]);
  const [filteredForums, setFilteredForums] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTags, setSearchTags] = useState("");

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
        setFilteredForums(data); // Initialize filtered forums with all forums
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
      setFilteredForums((prev) => [newForum, ...prev]); // Update filtered forums too
    } catch (err) {
      console.error("Error creating forum:", err);
      alert(err.response?.data?.error || "Failed to create forum");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTags(value);

    if (value.trim() === "") {
      setFilteredForums(forums); // Show all forums when search is empty
      return;
    }

    // Split the search input by commas and clean up each tag
    const searchTagsArray = value
      .toLowerCase()
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag !== "");

    // Filter forums that have at least one matching tag
    const filtered = forums.filter((forum) => {
      if (!forum.tags || forum.tags.length === 0) return false;
      const forumTagsLower = forum.tags.map((tag) => tag.toLowerCase());
      return searchTagsArray.some((searchTag) =>
        forumTagsLower.includes(searchTag)
      );
    });

    setFilteredForums(filtered);
  };

  if (isLoading)
    return <div className="text-center p-4">Loading forums...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-full px-4 py-4 m-10">
      <h2 className="text-2xl font-bold mb-6">University Forums</h2>
      <NewThreadForm onSubmit={handleNewThread} />

      {/* Search input for tags */}
      <div className="mb-4 mt-6">
        <input
          type="text"
          placeholder="Search by tags (comma separated)"
          value={searchTags}
          onChange={handleSearchChange}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="mt-4 space-y-4">
        {filteredForums.length === 0 ? (
          <p className="text-center text-gray-500">
            No forums match the selected tags.
          </p>
        ) : (
          filteredForums.map((forum) => (
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

              {/* Author information - new section */}
              <div className="mt-2 text-sm">
                <span className="text-gray-600">Posted by: </span>
                <Link
                  to={`/profile/${forum.createdBy}`}
                  className="text-blue-600 hover:underline"
                >
                  {forum.authorName || "Unknown User"}
                </Link>
              </div>

              {forum.tags && forum.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
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
