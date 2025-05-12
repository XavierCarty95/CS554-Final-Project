import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

function ProfessorsPage() {
  const { universityId } = useParams();
  const [professors, setProfessors] = useState([]);
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
      .get(`/professors/byUniversity/${universityId}`)
      .then((res) => {
        setProfessors(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching professors:", err);
        setError("Failed to load professors");
        setLoading(false);
      });
  }, [universityId]);

  if (loading) return <p className="text-center p-4">Loading professors...</p>;

  return (
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
        Professors at {university ? university.name : "University"}
      </h2>
      <p className="text-gray-600 mb-6">
        Browse all professors at this university
      </p>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {professors.length === 0 && !error ? (
        <p className="text-gray-500 italic p-4 bg-gray-50 rounded">
          No professors found for this university.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {professors.map((prof) => {
            const avgRating =
              prof.ratings && prof.ratings.length > 0
                ? (
                    prof.ratings.reduce((sum, r) => sum + r.score, 0) /
                    prof.ratings.length
                  ).toFixed(1)
                : null;

            return (
              <div
                key={prof._id}
                className="border rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <Link
                  to={`/university/${universityId}/professors/${prof._id}`}
                  className="block"
                >
                  <h3 className="text-xl font-semibold text-blue-600 hover:underline">
                    {prof.name}
                  </h3>
                  <p className="text-gray-700">{prof.department}</p>

                  {avgRating && (
                    <div className="mt-2 flex items-center">
                      <span className="text-yellow-500 mr-1">⭐</span>
                      <span className="font-medium">{avgRating}</span>
                      <span className="text-gray-500 ml-1">
                        ({prof.ratings.length} ratings)
                      </span>
                    </div>
                  )}

                  {prof.courses && prof.courses.length > 0 && (
                    <div className="mt-2 text-sm text-gray-500">
                      Teaching {prof.courses.length} course
                      {prof.courses.length !== 1 ? "s" : ""}
                    </div>
                  )}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ProfessorsPage;
