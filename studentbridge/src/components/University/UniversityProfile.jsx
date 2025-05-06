// src/components/University/UniversityProfile.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig";

const UniversityProfile = () => {
  const { universityId } = useParams();
  const [university, setUniversity] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/universities/${universityId}`)
      .then((response) => {
        setUniversity(response.data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching university details:", err);
        setError(
          err.response?.data?.error || "Failed to load university details"
        );
        setIsLoading(false);
      });
  }, [universityId]);

  const navigateToForums = () => {
    navigate(`/university/${universityId}/forums`);
  };

  if (isLoading)
    return <div className="text-center p-4">Loading university details...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;
  if (!university)
    return <div className="text-center p-4">University not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-3xl font-bold mb-4">{university.name}</h2>
      <p className="text-gray-600 mb-6">{university.location}</p>

      {university.overview && (
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Overview</h3>
          <p className="text-gray-700">{university.overview}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Quick Stats</h3>
          <ul className="space-y-2">
            <li>Professors: {university.professors?.length || 0}</li>
            <li>Courses: {university.courses?.length || 0}</li>
          </ul>
        </div>

        <div className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <div className="space-y-3">
            <button
              onClick={navigateToForums}
              className="w-full py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Discussion Forums
            </button>
            <button
    onClick={() => navigate(`/university/${universityId}/professors`)}
    className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
  >
    Rate My Professors
  </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UniversityProfile;
