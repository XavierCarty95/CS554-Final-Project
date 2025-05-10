import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await axios.get("/courses");
        setCourses(data);
      } catch (err) {
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  if (loading) return <p className="text-center mt-8">Loading courses...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="container mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-6">All Courses</h1>
      <div className="grid gap-8 md:grid-cols-3">
        {courses.map((course) => (
          <div
            key={course._id}
            className="flex flex-col p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4 truncate">{course.description}</p>
            <div className="mt-auto flex space-x-2">
              <NavLink
                to={`/courses/${course._id}`}
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                View Details
              </NavLink>
              <NavLink
                to={`/university/${course.universityId}`}
                className="inline-block px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                View University
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
