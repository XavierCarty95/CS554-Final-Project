import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getForums, createForum } from "../../services/forumServices";
import NewThreadForm from "./NewThreadForm";
import Footer from "../Footer";

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

    getForums(universityId)
      .then((data) => {
        setForums(data);
        setFilteredForums(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error loading forums:", err);
        setError(err.response?.data?.error || "Failed to load forums");
        setIsLoading(false);
      });
  }, [universityId]);

  // Function to filter forums based on search tags
  const filterForumsByTags = (forums, searchValue) => {
    if (searchValue.trim() === "") {
      return forums;
    }

    const searchInput = searchValue.toLowerCase().trim();

    return forums.filter((forum) => {
      if (!forum.tags || forum.tags.length === 0) return false;

      // Check if any tag starts with the search input
      return forum.tags.some((tag) =>
        tag.toLowerCase().startsWith(searchInput)
      );
    });
  };

  const handleNewThread = async (title, tags) => {
    // Validate title
    if (title.trim().length < 5) {
      alert("Title must be at least 5 characters long");
      return;
    }

    if (title.trim().length > 150) {
      alert("Title must be at most 150 characters long");
      return;
    }

    if (!/[a-zA-Z]/.test(title)) {
      alert("Title must contain at least one letter");
      return;
    }

    try {
      // Proceed with form submission
      const newForum = await createForum({
        title,
        universityId,
        tags,
      });

      // Update both forums and filteredForums states
      const updatedForums = [newForum, ...forums];
      setForums(updatedForums);

      // Apply current search filter to the updated forums list
      setFilteredForums(filterForumsByTags(updatedForums, searchTags));
    } catch (err) {
      console.error("Error creating forum:", err);
      alert(err.response?.data?.error || "Failed to create forum");
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTags(value);
    setFilteredForums(filterForumsByTags(forums, value));
  };

  if (isLoading)
    return <div className="text-center p-4">Loading forums...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col min-h-screen bg-gray-100">
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
        <Footer />
      </div>
   
    </>
  );
}
