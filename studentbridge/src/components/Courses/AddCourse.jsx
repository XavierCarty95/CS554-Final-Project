

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

function AddCourse() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/verify")
      .then((res) => {
        setUser(res.data);
        setUniversityId(res.data.universityId);
      })
      .catch(() => {
        setError("You must be logged in to add a course.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !universityId || !user?._id) {
      setError("All fields are required.");
      return;
    }

    try {
      const res = await axiosInstance.post("/courses", {
        title,
        description,
        universityId,
        professorId: user._id,
      });
      navigate(`/profile/${user._id}`);
    } catch (err) {
      setError("Failed to add course.");
    }
  };

  if (!user) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Course Title</label>
          <input
            className="w-full border p-2 rounded"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter course title"
            required
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Course Description</label>
          <textarea
            className="w-full border p-2 rounded"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter course description"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Course
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default AddCourse;