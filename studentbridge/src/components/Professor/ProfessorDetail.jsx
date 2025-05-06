import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../config/axiosConfig";

function ProfessorDetailPage() {
  const { universityId, professorId } = useParams();
  const [professor, setProfessor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch professor
    axios
      .get(`/professors/byUniversity/${universityId}`)
      .then((res) => {
        const found = res.data.find((p) => p._id === professorId);
        setProfessor(found || null);
      })
      .catch(() => setError("Failed to load professor data"));

    // Fetch reviews
    axios
      .get(`/reviews/${professorId}`)
      .then((res) => setReviews(res.data))
      .catch(() => setError("Could not load revie"));
  }, [universityId, professorId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/reviews", {
        professorId,
        userId: "mockUserId", // 🔐 Replace with real user ID when auth is added
        rating: Number(rating),
        comment,
      });
      setRating(5);
      setComment("");

      // Refresh reviews
      const refreshed = await axios.get(`/reviews/${professorId}`);
      setReviews(refreshed.data);
    } catch (err) {
      setError("Failed to submit review");
    }
  };

  if (!professor) return <p className="p-4 text-gray-500">Professor not found</p>;

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold">{professor.name}</h2>
      <p className="text-gray-600 mb-1">{professor.department}</p>
      {averageRating && (
        <p className="text-yellow-600 mb-4 font-medium">
          ⭐ Average Rating: {averageRating} / 5
        </p>
      )}

      <h3 className="text-xl font-semibold mt-6 mb-2">Submit a Review</h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 rounded"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <textarea
          className="w-full border p-2 rounded"
          value={comment}
          placeholder="Write your comment..."
          onChange={(e) => setComment(e.target.value)}
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Submit
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>

      <h3 className="text-xl font-semibold mt-8 mb-2">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="space-y-4">
          {reviews.map((rev) => (
            <li key={rev._id} className="border p-3 rounded bg-gray-50">
              <p className="font-semibold text-yellow-700">
                ⭐ {rev.rating} / 5
              </p>
              <p>{rev.comment}</p>
              {rev.createdAt && (
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(rev.createdAt).toLocaleDateString()}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfessorDetailPage;