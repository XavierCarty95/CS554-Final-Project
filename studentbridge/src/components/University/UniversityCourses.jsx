import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import Footer from "../Footer";

export default function UniversityCourses() {
  const { universityId } = useParams();

  const [courses, setCourses] = useState([]);
  const [university, setUniversity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/universities/${universityId}`)
      .then((res) => {
        setUniversity(res.data);
      })
      .catch((err) => {
        console.error("Error fetching university:", err);
        setError("Failed to load university information");
      });

    axiosInstance
      .get(`/universities/${universityId}/courses`)
      .then((res) => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses");
        setLoading(false);
      });
  }, [universityId]);

  if (loading) return <p className="text-center p-4">Loading courses...</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-4">
          <Link
            to={`/university/${universityId}`}
            className="text-blue-600 hover:underline flex items-center"
          >
            ← Back to University
          </Link>
        </div>

        <h2 className="text-2xl font-bold mb-2">
          Courses at {university ? university.name : "University"}
        </h2>
        <p className="text-gray-600 mb-6">
          Browse all courses at this university
        </p>

        {error && <div className="text-red-500 mb-4">{error}</div>}

        {courses.length === 0 && !error ? (
          <p className="text-gray-500 italic p-4 bg-gray-50 rounded">
            No courses found for this university.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div
                key={course._id}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Link to={`/courses/${course._id}`} className="block">
                  <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                    {course.title}
                  </h3>
                  <p className="text-gray-700 mt-1">{course.department}</p>
                  <p className="text-gray-600 mt-2 text-sm line-clamp-2">
                    {course.description || "No description available."}
                  </p>
                  <div className="mt-3 text-sm">
                    <span className="text-gray-500">Professor: </span>
                    <span className="text-gray-700">
                      {course.professorName}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
