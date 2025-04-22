import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import axios from "../../config/axiosConfig.js";

const UniversitySelection = () => {
  const [universities, setUniversities] = useState([]);
  const [Loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios
      .get("/universities")
      .then((response) => {
        setUniversities(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching universities:", err);
        setError(err.response?.data?.error || "Failed to load universities");
      });
  }, []);

  const handleUniversitySelect = (universityId) => {
    navigate("/university/" + universityId);
  };

  if (Loading)
    return <div className="text-center p-4">Loading universities...</div>;
  if (error)
    return <div className="text-center p-4 text-red-500">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Select a University</h2>

      <div className="mb-6">
        <label
          htmlFor="university-select"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Choose a university:
        </label>
        <select
          id="university-select"
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          onChange={(e) => handleUniversitySelect(e.target.value)}
          defaultValue=""
        >
          <option value="" disabled>
            Select a university
          </option>
          {universities.map((university) => (
            <option key={university._id} value={university._id}>
              {university.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {universities.map((university) => (
          <div
            key={university._id}
            className="border rounded-lg p-4 hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => handleUniversitySelect(university._id)}
          >
            <h3 className="text-lg font-semibold">{university.name}</h3>
            <p className="text-gray-600">{university.location}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UniversitySelection;
