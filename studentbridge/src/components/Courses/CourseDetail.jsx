import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";
import Footer from "../Footer";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [university, setUniversity] = useState(null);
  const [professor, setProfessor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const { data: courseData } = await axiosInstance.get(
          `/courses/${courseId}`
        );
        setCourse(courseData);

        const [uniRes, profRes] = await Promise.all([
          axiosInstance.get(`/universities/${courseData.universityId}`),
          axiosInstance.get(`/professors/${courseData.professorId}`),
        ]);

        setUniversity(uniRes.data);
        setProfessor(profRes.data);
      } catch (err) {
        console.error("Error fetching course details:", err);
        setError("Failed to load course details");
      } finally {
        setLoading(false);
      }
    }

    fetchDetails();
  }, [courseId]);

  if (loading)
    return <p className="text-center p-6">Loading course details...</p>;
  if (error) return <p className="text-red-600 text-center p-6">{error}</p>;
  if (!course) return <p className="text-center p-6">Course not found</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-4">
          <Link
            to="/courses"
            className="text-blue-600 hover:underline flex items-center"
          >
            ← Back to Courses
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>

          <div className="flex flex-wrap gap-4 mb-6">
            {university && (
              <Link
                to={`/university/${university._id}`}
                className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
              >
                {university.name}
              </Link>
            )}

            {professor && (
              <Link
                to={`/university/${course.universityId}/professors/${professor._id}`}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium"
              >
                {professor.name}
              </Link>
            )}
          </div>

          <div className="prose max-w-none">
            <h2 className="text-xl font-semibold mb-2">Course Description</h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              {course.description ||
                "No description available for this course."}
            </p>
          </div>

          <div className="mt-8 border-t pt-6">
            <h2 className="text-xl font-semibold mb-4">Course Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-gray-600 font-medium">University</h3>
                <p>{university ? university.name : "Unknown"}</p>
              </div>

              <div>
                <h3 className="text-gray-600 font-medium">Professor</h3>
                <p>{professor ? professor.name : "Unknown"}</p>
              </div>

              {professor && (
                <div>
                  <h3 className="text-gray-600 font-medium">Department</h3>
                  <p>{professor.department || "Not specified"}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
