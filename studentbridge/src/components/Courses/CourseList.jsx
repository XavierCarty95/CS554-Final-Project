import React, { useState, useEffect } from "react";
import axios from "../../config/axiosConfig";
import { NavLink } from "react-router-dom";
import Footer from "../Footer";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [professorsMap, setProfessorsMap] = useState({});
  const [universitiesMap, setUniversitiesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  useEffect(() => {
    async function fetchCourses() {
      try {
        const { data } = await axios.get("/courses");
        setCourses(data);
        setFilteredCourses(data);

        // Extract unique professorIds and universityIds
        const professorIds = [
          ...new Set(
            data.map((course) => course.professorId).filter((id) => id)
          ),
        ];

        const universityIds = [
          ...new Set(
            data.map((course) => course.universityId).filter((id) => id)
          ),
        ];

        const professorPromises = professorIds.map((id) =>
          axios.get(`/professors/${id}`)
        );
        const professorResponses = await Promise.all(professorPromises);

        const profMap = {};
        professorResponses.forEach((res) => {
          const prof = res.data;
          profMap[prof._id] = prof.name;
        });
        setProfessorsMap(profMap);

        // Fetch university details in parallel
        const universityPromises = universityIds.map((id) =>
          axios.get(`/universities/${id}`)
        );
        const universityResponses = await Promise.all(universityPromises);

        const uniMap = {};
        universityResponses.forEach((res) => {
          const uni = res.data;
          uniMap[uni._id] = uni.name;
        });
        setUniversitiesMap(uniMap);
      } catch (err) {
        console.error("Error loading data:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (value.trim() === "") {
      setFilteredCourses(courses);
      return;
    }

    const lowerValue = value.toLowerCase();

    const filtered = courses.filter((course) =>
      course.title.toLowerCase().includes(lowerValue)
    );

    setFilteredCourses(filtered);
  };

  if (loading) return <p className="text-center mt-8">Loading courses...</p>;
  if (error) return <p className="text-red-600 text-center mt-8">{error}</p>;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="container mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold mb-6">All Courses</h1>

        <input
          type="text"
          placeholder="Search courses by title..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-2 mb-6 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="grid gap-8 md:grid-cols-3">
          {filteredCourses.length === 0 ? (
            <p className="text-center text-gray-500">No courses found.</p>
          ) : (
            filteredCourses.map((course) => (
              <div
                key={course._id}
                className="flex flex-col p-6 bg-white rounded-2xl shadow hover:shadow-xl transition"
              >
                <h2 className="text-2xl font-semibold mb-2">{course.title}</h2>
                <p className="text-gray-600 mb-1">
                  University: {universitiesMap[course.universityId] || "N/A"}
                </p>
                <p className="text-gray-600 mb-1">
                  Department: {course.department || "N/A"}
                </p>
                <p className="text-gray-600 mb-4">
                  Professor: {professorsMap[course.professorId] || "N/A"}
                </p>
                <p className="text-gray-600 mb-4 truncate">
                  {course.description}
                </p>
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
            ))
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}
