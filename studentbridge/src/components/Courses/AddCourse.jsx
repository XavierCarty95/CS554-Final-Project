/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

function AddCourse() {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [description, setDescription] = useState("");
  const [universityId, setUniversityId] = useState("");
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");
  const [availableCourses, setAvailableCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/verify")
      .then((res) => {
        setUser(res.data);
        setUniversityId(res.data.universityId);
        axiosInstance
          .get(`/courses/university/${res.data.universityId}/dropdown`)
          .then((res) => setAvailableCourses(res.data))
          .catch(() => console.warn("Failed to load available courses"));
      })
      .catch(() => {
        setError("You must be logged in to add a course.");
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCourseId || !universityId || !user?._id) {
      setError("All fields are required.");
      return;
    }

    const selectedCourse = availableCourses.find(c => c._id === selectedCourseId);
    if (!selectedCourse) {
      setError("Selected course is invalid.");
      return;
    }

    try {
      const res = await axiosInstance.post("/courses", {
        title: selectedCourse.title,
        description: selectedCourse.description,
        universityId,
        professorId: user._id,
      });
      navigate(`/profile/${user._id}`);
      setSelectedCourseId("");
    } catch (err) {
      setError("Failed to add course.");
    }
  };

  if (!user) {
    return <p className="p-4 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Add New Course</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="course-select" className="block mb-2 font-medium">
            Course Title
          </label>
          {availableCourses.length === 0 ? (
            <p className="text-gray-500">No available courses to select.</p>
          ) : (
            <select
              id="course-select"
              className="w-full border p-2 rounded"
              value={selectedCourseId}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              required
            >
              <option value="">Select a course</option>
              {availableCourses.map((course) => (
                <option key={course._id} value={course._id}>
                  {course.title}
                </option>
              ))}
            </select>
          )}
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2"
        >
          Add Course
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
}

export default AddCourse;