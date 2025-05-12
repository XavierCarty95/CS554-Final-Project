// src/components/Professor/ProfessorsPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axiosInstance from "../../config/axiosConfig";

function ProfessorsPage() {
  const { universityId } = useParams();
  const [professors, setProfessors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/professors/byUniversity/${universityId}`)
      .then(async (res) => {
        const profsWithRatings = await Promise.all(
          res.data.map(async (prof) => {
            try {
              const reviewRes = await axiosInstance.get(`/reviews/${prof._id}`);
              return { ...prof, ratings: reviewRes.data || [] };
            } catch {
              return { ...prof, ratings: [] };
            }
          })
        );
        setProfessors(profsWithRatings);
      })
      .catch(() => {
        setError("Failed to load professors");
      });
  }, [universityId]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Professors at This University</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {professors.length === 0 && !error ? (
        <p className="text-gray-500 italic">No professors found for this university.</p>
      ) : (
        <ul className="space-y-3">
          {professors.map((prof) => (
            <li key={prof._id} className="p-4 border rounded">
              <h3 className="text-lg font-semibold">
                <Link
                  to={`/university/${universityId}/professors/${prof._id}`}
                  className="text-blue-600 hover:underline"
                >
                  {prof.name}
                </Link>
              </h3>
              <p>{prof.department}</p>
              <p>
                Rating:{" "}
                {prof.ratings && prof.ratings.length > 0
                  ? (
                      prof.ratings.reduce((sum, r) => sum + r.rating, 0) /
                      prof.ratings.length
                    ).toFixed(1)
                  : "No ratings yet"}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfessorsPage;
