import React, { useState, useEffect } from "react";
import { useParams, NavLink } from "react-router-dom";
import axios from "../../config/axiosConfig";

export default function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [universityName, setUniversityName] = useState("");
  const [professorName, setProfessorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetails() {
      try {
        // Fetch course data
        const { data: courseData } = await axios.get(`/courses/${courseId}`);
        setCourse(courseData);

        // Fetch related names
        const [uniRes, profRes] = await Promise.all([
          axios.get(`/universities/${courseData.universityId}`),
          axios.get(`/professors/${courseData.professorId}`),
        ]);
        setUniversityName(uniRes.data.name || "");
        setProfessorName(profRes.data.name || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load course details.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [courseId]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;
  if (!course) return <p className="text-center mt-8">Course not found</p>;

  return (
    <div className="container mx-auto px-6 py-10 max-w-2xl">
      <h1 className="text-4xl font-bold mb-4">{course.title}</h1>
      <p className="text-gray-700 mb-6 leading-relaxed">{course.description}</p>
      <div className="space-y-2">
        <p className="text-gray-600">
          <strong>University:</strong>{" "}
          <NavLink
            to={`/university/${course.universityId}`}
            className="text-blue-600 hover:underline"
          >
            {universityName}
          </NavLink>
        </p>
        <p className="text-gray-600">
          <strong>Professor:</strong>{" "}
          <NavLink
            to={`/university/${course.universityId}/professors/${course.professorId}`}
            className="text-blue-600 hover:underline"
          >
            {professorName}
          </NavLink>
        </p>
      </div>
    </div>
  );
}
